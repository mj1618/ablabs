import React from 'react';

export default class Login extends React.Component {
    render(){
        return <div className="row" style={{marginTop:'10vh'}}>
            <div className="col-md-4 col-md-push-4 col-sm-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Login or Sign up</h3>
                    <p className="text-muted m-b-20">Use any of the following to login  or sign up</p>
                    <p className="text-muted m-b-20"></p>
                    <a href="/login/google" className="btn-social-login btn btn-outline btn-default btn-lg btn-block waves-effect" type="button"> 
                        <img src="/images/g-logo.png" className="social-login-left google-icon" /> <span>Continue with Google</span>
                    </a>
                    <a href="/login/facebook" className="btn btn-facebook btn-social-login waves-effect waves-light btn-outline btn-lg btn-block" type="button"> 
                        <i className="social-login-left fa fa-facebook"></i> <span>Continue with Facebook</span>
                    </a>

                    <a href="/login/github" className="btn btn-github btn-social-login waves-effect waves-light btn-outline btn-lg btn-block" type="button"> 
                        <i className="social-login-left fa fa-github"></i> <span>Continue with GitHub</span>
                    </a>

                    {/*<h3 className="text-center">Or </h3>
                    <a href="/login/email" className="btn btn-outline btn-social-login btn-primary fcbtn btn-1e btn-lg btn-block waves-effect">
                        <i className="social-login-left fa fa-envelope"></i> <span>Continue with Email</span>
                    </a>*/}
                </div>
            </div>
        </div>;
    }
};