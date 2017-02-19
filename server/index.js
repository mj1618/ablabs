import express from 'express';
import request from 'request';
import fetch from 'node-fetch';
import {User,Experiment,Project,Event,Variation,Assign,Track} from './model';
import auth from './auth';
import Promise from 'bluebird';

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
        return Track.query()
            .select('event_id','variation_id')
            .whereIn('event_id',experiment.events.map(e=>e.id))
            .whereIn('variation_id',experiment.variations.map(v=>v.id))
            .groupBy('event_id')
            .groupBy('variation_id')
            .count()
            .then(ns=>{
                return exp.variations.map(v=>{
                    let res = {
                        variation: v.name
                    };
                    ns.filter(n => n.variation_id===v.id).forEach(n=>{
                        let eventName = experiment.events.find(e=>e.id===n.event_id).name;
                        res[eventName] = n['count(*)'];
                    });
                    return res;
                });
            })
    })
    .then((ns) => {
        return createPageData(req, {
            routeId: 'view-experiment',
            title: experiment.name,
            experiment,
            values: ns
        });
    })
    .then(pageData=>{
        res.render('dashboard', {
            pageData
        });
    });
});


app.get('/projects/create', loginMiddleware, (req, res) => {
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
    Event.query().insert({name:req.body.name, project_id: req.session.project}).then(event=>{
        res.json({result:'success', event:{
            id: event.id,
            name: event.name,
            nTracks: 0,
            nExperiments: 0
        }});
    });
});

const sumCohorts = (experiments )=>{
    return Promise.map(experiments, experiment => {
        return experiment.$relatedQuery('variations');
    }).then(vvs=>{
        return vvs.map(vs=>{
            return vs.reduce((t,v) => t+v.cohort, 0);
        })
    })
}
const sumTracks = (experiments )=>{
    return Promise.map(experiments, experiment => {
        return 
    })
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
