import express from 'express';
import request from 'request';
import fetch from 'node-fetch';
import {User,Experiment,Project,Event,Variation,Assign,Track} from './model';
import auth from './auth';
import Promise from 'bluebird';
import df from 'dateformat';

const autoLogin = true;

var app = express();
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: 'CBiHUkkdqaMTh80iUVzdSPver41P5fKgDMC07SlDUryG5aTk0MJY4UbQTm7wyagO', resave: false, saveUninitialized: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

auth(app, (req,res,profile)=>{
    User.query().where('email', profile.email).then(users=>{
        if(users.length===0){
            console.log('inserting user: '+user.id);
            User.query().insert({
                email: profile.email,
                verified_email: profile.verified_email,
                first_name: profile.given_name,
                last_name: profile.family_name,
                google_link: profile.link,
                picture: profile.picture
            }).then(result=>{
                req.session.user = result.id;
                res.redirect('/');
            });
        } else {
            let user=users[0];
            req.session.user = user.id;
            res.redirect('/');
        }
    });
}, (req,res)=>{
    res.redirect('/');
});

const createPageData = (req, data) => {
    return Promise.join(
        req.session.project ? Project.query().findById(req.session.project).eager('[experiments,events]') : null,
        req.session.user ? User.query().findById(req.session.user).eager('projects') : null,
        (project, user) => {
            return Object.assign({},{
                nProjects: user ? user.projects.length : 0,
                projects: user ? user.projects : [],
                nExperiments: project ? project.experiments.length : 0,
                nEvents: project ? project.events.length : 0,
                projectName: project ? project.name : '',
                token: project ? project.token : '',
                showTitle: true,
                showMenu: true,
                showSearch: true,
                showNotifications: true,
                showAccount: true
            }, data);
        }
    );
}

const loginMiddleware = (req,res,next)=>{
    if(!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
    
}

const authMiddleware = (req,res,next)=>{
    if(!req.session.user) {
        res.redirect('/login');
    } else if(!req.session.project){
        User.query().findById(req.session.user).eager('projects').then(user=>{
            let projects = user.projects;
            if(projects.length>0){
                console.log(JSON.stringify(projects));
                req.session.project = projects[0].id;
                res.redirect('/');
            } else {
                res.redirect('/projects/create');
            }
        });
    } else {
        next();
    }
}

app.get('/', authMiddleware, (req, res) => {
    res.redirect('/experiments');
});

const chooseVariation = (variations) => {
    let rand = Math.random();
    return variations.find(v=>{
        let x = v.cohort / 100.0;
        if(rand < x){
            return true;
        } else {
            rand -= x;
            return false;
        }
    });
}

const slugify = (n) => {
    return n.toLowerCase()
        .replace(/[^a-z0-9-]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

const compareSlug = (n1,n2) => {
    console.log(slugify(n1) +' '+ slugify(n2));
    return slugify(n1) == slugify(n2);
};

const apiMiddleware = (req,res,next)=>{
    const token = req.query.token;
    if(token==null){
        res.json({result:'fail', error: 'no token'});
    } else {
        Project.query().where('token',token).then(ps=>{ 
            if(ps.length===0){
                res.json({result:'fail', error: 'invalid token'});
            } else {
                next();
            }
        });
    }
}

// http://localhost:3000/api/track?event=logged-in&user=100009&experiments=facebook-redirect&token=164896c8b1a5eafc84dc02230951974a
app.get('/api/track', apiMiddleware, (req, res) => {
    const token = req.query.token;
    const slug = req.query.event;
    const uniqueId = req.query.user;
    const amount = req.query.amount ? req.query.amount : 1;
    const experimentSlugs = req.query.experiments ? req.query.experiments.split(',') : [];
    let project;
    let event;

    if(uniqueId==null){
        res.json({result:'fail', error: 'no user'});
    } else {
       Project.query().where('token',token).eager('[experiments.variations]').then(ps=>{
           project = ps[0];
           return Event.query().where('project_id',project.id);
       }).then(es => {
           event = es.find(e=>compareSlug(e.name, slug));
           if(event==null){
               throw 'invalid event';
           }
           let exps = project.experiments.filter(e=>experimentSlugs.some(s=>compareSlug(s,e.name)));
           if(exps.length === 0) {
               throw 'no experiments given';
           }

           return Promise.all(
               exps.map(exp => {
                   Assign.query().where('unique_id',uniqueId).where('experiment_id',exp.id).then(as=>{
                        if(as.length===0){
                            const v = chooseVariation(exp.variations);
                            return Assign.create(exp, v, uniqueId);
                        } else {
                            return as[0];
                        }
                   }).then(a => {
                       return Track.create(project.id, exp.id, a.variation_id, event.id, uniqueId, amount);
                   })
               })
           );
       }).then(()=>{
           res.json({result:'success'});
       }).catch(e=>{
            res.json({result:'fail', error: e});
            console.error(e);
        });
    }
});
// localhost:3000/api/assign?experiment=facebook-redirect&user=100009&token=164896c8b1a5eafc84dc02230951974a
app.get('/api/assign', apiMiddleware, (req, res) => {
    const token = req.query.token;
    const slug = req.query.experiment;
    const uniqueId = req.query.user;
    let project;
    let experiment;

    Project.query().where('token',token).eager('experiments.variations').then(ps=>{ 
        if(ps.length===0){
            throw 'invalid token';
        } else if(!ps[0].experiments.find(e=>compareSlug(e.name, slug))){
            throw 'invalid experiment';
        } else if(!uniqueId){
            throw 'no user';
        } else {
            project = ps[0];
            experiment = project.experiments.find(e=>compareSlug(e.name, slug));
            if(experiment!=null){
                return Assign.query().where('experiment_id',experiment.id).where('unique_id',uniqueId);
            } else {
                throw 'Experiment not found';
            }
        }
    }).then(as=>{
        if(as.length===0){
            const v = chooseVariation(experiment.variations);
            return Assign.create(experiment, v, uniqueId);
        } else {
            return as[0];
        }
    }).then(a=>{
        res.json({result:'success', experiment: experiment.name, variation: a.variation_id!=null ? experiment.variations.find(v=>v.id===a.variation_id).name : 'none'});
    }).catch(e=>{
        res.json({result:'fail', error: e});
        console.error(e);
    });

});

app.get('/login', (req, res) => {
    if(autoLogin){
        User.query().where('email','matthew.stephen.james@gmail.com').then(users=>{
            req.session.user = users[0].id;
            res.redirect('/');
        });
    } else {
        res.render('dashboard',{
            pageData: {
                routeId: 'login',
                showMenu: false,
                showTitle: false,
                showSearch: false,
                showNotifications: false,
                showAccount: false
            }
        });
    }
});

app.get('/login/email', (req, res) => {
    res.render('dashboard',{
        pageData: {
            routeId: 'login-email',
            showMenu: false,
            showTitle: false
        }
    });
});

app.get('/logout', (req,res)=>{
    req.session.user = null;
    req.session.project = null;
    res.redirect('/');
});


app.get('/experiments/:experimentId/view', authMiddleware, (req, res) => {
    let experiment;
    Experiment.query().findById(req.params.experimentId).eager('[variations,events]')
    .then(exp=>{
        experiment = exp;
        return Promise.join(
            Assign.query()
                .select('variation_id')
                .whereIn('variation_id',experiment.variations.map(v=>v.id))
                .groupBy('variation_id')
                .countDistinct('unique_id')
                .then(res=>{
                    let as = {};
                    exp.variations.forEach(v=>{
                        as[v.name] = res.find(r=>r.variation_id===v.id)['count(distinct `unique_id`)'];
                    });
                    return as;
                }),
            Track.query()
                .select('event_id','variation_id')
                .whereIn('event_id',experiment.events.map(e=>e.id))
                .whereIn('variation_id',experiment.variations.map(v=>v.id))
                .groupBy('event_id')
                .groupBy('variation_id')
                .countDistinct('unique_id')
                .then(ns=>{
                    return exp.variations.map(v=>{
                        let res = {
                            variation: v.name,
                            variation_id: v.id
                        };
                        ns.filter(n => n.variation_id===v.id).forEach(n=>{
                            let eventName = experiment.events.find(e=>e.id===n.event_id).name;
                            res[eventName] = n['count(distinct `unique_id`)'];
                        });
                        return res;
                    });
                }),
            Track.query()
                .select('event_id','variation_id','created_at')
                .whereIn('event_id',experiment.events.map(e=>e.id))
                .whereIn('variation_id',experiment.variations.map(v=>v.id))
                .groupBy('created_at')
                .groupBy('event_id')
                .groupBy('variation_id')
                .orderBy('created_at')
                .countDistinct('unique_id')
                .then(lvs=>{
                    const results = {};
                    exp.events.forEach(e=>{
                        const data = {};
                        lvs.filter(v=>v.event_id===e.id).forEach(v=>{
                            if(!data[df(v.created_at,'yyyy-mm-dd')]){
                                data[df(v.created_at,'yyyy-mm-dd')] = {
                                    date: df(v.created_at,'yyyy-mm-dd')
                                };
                                experiment.variations.forEach(va=>{
                                    data[df(v.created_at,'yyyy-mm-dd')][va.name] = 0;
                                })
                            }
                            data[df(v.created_at,'yyyy-mm-dd')][experiment.variations.find(va=>va.id===v.variation_id).name] += v['count(distinct `unique_id`)'];
                        })
                        results[e.name] = Object.values(data);
                    });
                    return results;
                }),
            (as,ns,lvs) => {
                return createPageData(req, {
                    routeId: 'view-experiment',
                    title: experiment.name,
                    experiment,
                    values: ns,
                    assigns: as,
                    lineChartValues: lvs
                });
            })
    })
    .then(pageData=>{
        res.render('dashboard', {
            pageData
        });
    });
});

app.get('/create-project', loginMiddleware, (req, res) => {
    createPageData(req, {
        routeId: 'create-project',
        showMenu: false,
        showSearch:false,
        title: 'Create Project'
    }).then(pageData=>{
        res.render('dashboard', {
            pageData
        });
    });
});

app.get('/switch-project/:projectId', loginMiddleware, (req, res) => {
    req.session.project = req.params.projectId;
    res.redirect('/');
});

app.get('/settings', authMiddleware, (req, res) => {
    Project.query().findById(1).eager('users').then(project=>{
        return createPageData(req, {
            routeId: 'project-settings',
            title: 'Project Settings',
            users: project.users
        });
    })
    .then(pageData=>{
        res.render('dashboard', {
            pageData
        });
    });
});

app.post('/projects/create', loginMiddleware, (req, res) => {
    Project.create(req.body.name, req.session.user).then(project=>{
        req.session.project = project.id;
        res.redirect('/experiments');
    });
});

app.post('/events/create', authMiddleware, (req, res) => {
    Event.query().where('project_id',req.session.project).then(es=>{
        if(es.some(e=>compareSlug(e.name,req.body.name))){
            res.json({result:'fail',error:'An event with that name already exists'});
        } else {
            Event.query().insert({name:req.body.name, project_id: req.session.project}).then(event=>{
                res.json({result:'success', event:{
                    id: event.id,
                    name: event.name,
                    nTracks: 0,
                    nExperiments: 0
                }});
            });
        }
    });
});

const sumCohorts = (experiments )=>{
    return Promise.map(experiments, experiment => {
        return experiment.$relatedQuery('variations');
    }).then(vvs=>{
        return vvs.map(vs=>{
            return vs.reduce((t,v) => t+v.cohort, 0);
        });
    });
}
const sumTracks = (experiments )=>{
    return Promise.map(experiments, experiment => {
        return 
    });
}

app.get('/experiments', authMiddleware, (req, res) => {
    Experiment.query().where('project_id',req.session.project).eager('variations').then(experiments=>{
        return Promise.join(
            Assign.query().whereIn('variation_id',[1,2,3]).count().then(c=>c.length>0 ? c[0]['count(*)'] : 0),
            Track.query().whereIn('variation_id',[1,2,3]).count().then(c=>c.length>0 ? c[0]['count(*)'] : 0),
            (nUsers, nTracks)=>{
                return experiments.map((exp,i) => {
                    exp.nTracks = nTracks;
                    exp.cohort = exp.variations.reduce((t, v)=>t+v.cohort,0);
                    exp.nUsers = nUsers;
                    return exp;
                });
            });
    }).then(experiments=>{
        return createPageData(req,{
            routeId: 'experiments',
            title: 'Experiments',
            experiments
        });
    }).then((pageData)=>{
        res.render('dashboard',{
            pageData
        });
    })
});

app.get('/events', authMiddleware, (req, res) => {
    Event.query().where('project_id',1).orderBy('id','desc').eager('[tracks,experiments]').then(events=>{
        console.log(JSON.stringify(events));
        return createPageData(req,{
            routeId: 'events',
            title: 'Events',
            events: events.map(event=>{
                return {
                    id: event.id,
                    name: event.name,
                    nTracks: event.tracks.length,
                    nExperiments: event.experiments.length
                }
            })
        });
    }).then((pageData)=>{
        res.render('dashboard',{
            pageData
        });
    })
});

app.post('/experiments/:experimentId/toggle', authMiddleware, (req,res)=>{
    Experiment.query().findById(req.params.experimentId).then(exp=>{
        return exp.$query().updateAndFetch({active: !exp.active})
    }).then(newExp => {
        res.json({result:'success',active:newExp.active});
    })
});

app.get('/experiments/create', authMiddleware, (req, res) => {
    Event.query().where('project_id',req.session.project).then(events=>{
        return createPageData(req,{
            routeId: 'create-experiment',
            title:'Create Experiment',
            events
        });
    }).then((pageData)=>{
        res.render('dashboard',{
            pageData
        });
    })
});

app.get('/developer', authMiddleware, (req, res) => {
    Promise.join(
        Event.query().where('project_id',req.session.project),
        Experiment.query().where('project_id',req.session.project).eager('variations'),
        (events,experiments) => {
            createPageData(req,{
                routeId: 'developer',
                title:'Developer Guide',
                events,
                experiments
            }).then((pageData)=>{
                res.render('dashboard',{
                    pageData
                });
            })
        }
    );
});

app.get('/experiments/:experimentId/edit', authMiddleware, (req, res) => {
    Promise.join(
        Event.query().where('project_id',req.session.project),
        Experiment.query().findById(req.params.experimentId).eager('[variations,events]'),
        (events,experiment)=>{
            return createPageData(req,{
                routeId: 'edit-experiment',
                title:'Edit Experiment',
                events,
                experiment
            }).then((pageData)=>{
                res.render('dashboard',{
                    pageData
                });
            });
        }
    );
});

app.post('/experiments/create', authMiddleware, (req,res) => {
    let experiment;
    Experiment.query().insert({
        project_id: req.session.project,
        name: req.body.name,
        description: req.body.description,
        active: true
    }).then(exp => {
        experiment = exp;
        return Promise.all(req.body.selectedEvents.map(event=>{
            return experiment.$relatedQuery('events').relate(event.id)
        }));
    }).then(()=>{
        return Promise.all(req.body.variations.map(variation => {
            return Variation.query().insert({
                name: variation.name,
                description: variation.description,
                cohort: variation.cohort,
                experiment_id: experiment.id
            })
        }));
    }).then(()=>{
        res.json({result:'success', experiment});
    }).catch((e)=>{
        console.error(e);
        if(experiment){
            Experiment.query().where('id',experiment.id).delete();
        }
        res.json({result:'error'});
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});

export default app;
