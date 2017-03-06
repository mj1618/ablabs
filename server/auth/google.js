import { User } from '../model';
import fetch from 'node-fetch';
const querystring = require('querystring');
export default (app, loginSuccess, loginError) => {
    const clientId = process.env.AB_GOOGLE_ID;
    const clientSecret = process.env.AB_GOOGLE_SECRET;
    const redirectUri = process.env.AB_GOOGLE_URI;
    app.get('/login/google', (req,res) => {
        res.redirect('https://accounts.google.com/o/oauth2/v2/auth?redirect_uri='+redirectUri+'&response_type=code&client_id='+clientId+'&scope=https://www.googleapis.com/auth/userinfo.email');
    });
    app.get('/auth/google/callback',(req,res)=> {
        fetch('https://accounts.google.com/o/oauth2/token', {
            method: 'POST',
            body: querystring.stringify({
                code: req.query.code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }),
            headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).then(function(res2) {
            return res2.json();
        }).then(function(json) {
            return fetch('https://www.googleapis.com/oauth2/v1/userinfo?access_token='+json.access_token);
        }).then(function(prof){
            return prof.json();
        }).then((profile)=>{
            loginSuccess(req,res,profile);
        }).catch(e => {
            loginError(req,res);
        });
    });

};
