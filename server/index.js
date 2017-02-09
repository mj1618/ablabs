import express from 'express';
import passport from 'passport';
import request from 'request';
import fetch from 'node-fetch';
import {User,Experiment} from './model';
import auth from './auth';

var app = express();
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: 'p9re8gyp9eurhgisuhgis', resave: false, saveUninitialized: true }));
app.use(express.static('./public'));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

auth(app);

app.get('/', (req, res) => {
    res.redirect('/experiments');
});

app.get('/login', (req, res) => {
    res.render('login',{
        pageData: {
            routeId: 'login'
        }
    });
});


app.get('/experiments', (req, res) => {
    Experiment.where({account_id:1}).fetchAll().then(es=>{
        res.render('dashboard',{
            pageData: {
                routeId: 'experiments',
                title:'Experiments',
                experiments: es.map(e=>e)
            }
        });
    })
    
});


app.listen(3000, function () {
    console.log('Listening on port 3000!');
});

export default app;
