import { User } from '../model';
import fetch from 'node-fetch';
const querystring = require('querystring');
export default (app, loginSuccess, loginError) => {
    const clientId = process.env.AB_FACEBOOK_ID;
    const clientSecret = process.env.AB_FACEBOOK_SECRET;
    const redirectUri = process.env.AB_FACEBOOK_URI;
    app.get('/login/facebook', (req,res) => {
        res.redirect('https://www.facebook.com/v2.8/dialog/oauth?redirect_uri='+redirectUri+'&response_type=code&client_id='+clientId+'&scope=email');
    });
    app.get('/auth/facebook/callback',(req,res)=> {
        fetch('https://graph.facebook.com/v2.8/oauth/access_token', {
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
            return fetch('https://graph.facebook.com/me?fields=email&access_token='+json.access_token);
        }).then(function(prof){
            return prof.json();
        }).then((profile)=>{
            console.log(profile);
            loginSuccess(req,res,profile);
        }).catch(e => {
            loginError(req,res);
        });
    });

};
