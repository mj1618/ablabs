import google from './google';
import facebook from './facebook';
import github from './github';

export default (app, loginSuccess, loginError) => {
    google(app, loginSuccess, loginError);
    facebook(app, loginSuccess, loginError);
    github(app, loginSuccess, loginError);
};
