import express from 'express';
import request from 'request';
import fetch from 'node-fetch';
import {User,Experiment,Project,Event} from './model';
import auth from './auth';
import Promise from 'bluebird';

var app = express();
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: 'CBiHUkkdqaMTh80iUVzdSPver41P5fKgDMC07SlDUryG5aTk0MJY4UbQTm7wyagO', resave: false, saveUninitialized: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

auth(app);

const createPageData = (req, data) => {
    return Promise.join(
        Experiment.where({project_id:req.session.project}).count(),
        Project.where({id:req.session.project}).fetch(),
        (nExperiments, project)=>{
            return Object.assign(data,{
                nExperiments,
                projectName: project.get('name'),
                showTitle: true,
                showMenu: true,
                showSearch: true,
                showNotifications: true,
                showAccount: true
            });
        });
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
        User.projects().then(projects=>{
            if(projects.length>0){
                console.log(JSON.stringify(projects));
                req.session.project = projects.pop().id;
                res.redirect('/');
                // res.redirect('/create-first-project');
            } else {
                res.redirect('/create-first-project');
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

app.get('/create-first-project', loginMiddleware, (req, res) => {
    res.render('dashboard', {
        pageData: {
            routeId: 'create-project',
            showMenu: false,
            title: 'Create Project'
        }
    });
});

app.post('/projects/create', loginMiddleware, (req, res) => {
    Project.create(req.body.name, req.session.user).then(project=>{
        req.session.project=project.id;
        res.redirect('/experiments');
    });
});

app.post('/events/create', authMiddleware, (req, res) => {
    Event.create(req.body.name, req.session.project).then(event=>{
        res.json({result:'success', event});
    });
});

app.get('/experiments', authMiddleware, (req, res) => {
    Experiment.where({project_id:1}).fetchAll().then(es=>{
        return createPageData(req,{
            routeId: 'experiments',
            title: 'Experiments',
            experiments: es.map(e=>e)
        });
    }).then((pageData)=>{
        res.render('dashboard',{
            pageData
        });
    })
});

app.get('/experiments/create', authMiddleware, (req, res) => {
    Event.findByProject(req.session.project).then(events=>{
        return createPageData(req,{
            routeId: 'create-experiment',
            title:'Create Experiment',
            events
        });
    }).then((pageData)=>{
        res.render('dashboard',{
            pageData
        });
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});

export default app;
