import { User } from '../model/index';
import bcrypt from 'bcrypt';

function validEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export default app => {

    app.get('/login', (req,res) => {
        res.render('login');
    });

    app.post('/login', (req, res) => {
        // req.body.email
    });

    app.get('/logout', (req, res) => {
        delete req.session.email;
        res.redirect('/');
    });
}
