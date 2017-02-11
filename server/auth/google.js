import { User } from '../model';
import fetch from 'node-fetch';
const querystring = require('querystring');
export default (app) => {
    const clientId = '1024263950548-0iihqge4pt2jsmatkpp371f5hkls3g4p.apps.googleusercontent.com'
    const clientSecret = 'zyEjfHbecBydCBBvah58vgmE';
    const redirectUri = 'http://localhost:3000/auth/google/callback';
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
        }).then(function(profile){
            console.log(JSON.stringify(profile));
            User.where({email: profile.email}).fetch().then((user)=>{
                console.log(JSON.stringify(user));
                if(!user){
                    console.log('saving user');
                    (new User({
                        email: profile.email,
                        verified_email: profile.verified_email,
                        first_name: profile.given_name,
                        last_name: profile.family_name,
                        google_link: profile.link,
                        picture: profile.picture
                    }))
                    .save()
                    .then((result)=>{
                        req.session.user = result.id;
                        res.redirect('/');
                    });
                } else {
                    console.log('setting user session');
                    req.session.user = user.id;
                    res.redirect('/');
                }
            });

        });
    });

};
