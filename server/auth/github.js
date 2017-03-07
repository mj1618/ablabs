import { User } from '../model';
import fetch from 'node-fetch';
const querystring = require('querystring');
export default (app, loginSuccess, loginError) => {
    const clientId = process.env.AB_GITHUB_ID;
    const clientSecret = process.env.AB_GITHUB_SECRET;
    const redirectUri = process.env.AB_GITHUB_URI;
    app.get('/login/github', (req,res) => {
        res.redirect('https://github.com/login/oauth/authorize?redirect_uri='+redirectUri+'&response_type=code&client_id='+clientId+'&scope=user:email');
    });
    app.get('/auth/github/callback',(req,res)=> {
        console.log('0');
        fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: querystring.stringify({
                code: req.query.code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        }).then(function(res2) {
            console.log('1');
            console.log(res2);
            return res2.json();
        }).then(function(json) {
            console.log('2');
            console.log(json.access_token);
            return fetch('https://api.github.com/user/emails?access_token='+json.access_token);
        }).then(function(prof){
            console.log('profile');
            console.log(prof);
            return prof.json();
        }).then((profile)=>{
            console.log(profile);
            loginSuccess(req,res,profile[0]);
        }).catch(e => {
            console.error(e);
            loginError(req,res);
        });
    });

};
