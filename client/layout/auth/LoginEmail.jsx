import React from 'react';

export default class LoginEmail extends React.Component {
    render(){
        return <div className="row" style={{marginTop:'10vh'}}>
            <div className="col-md-4 col-md-push-4 col-sm-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Login or Sign up with Email</h3>
                    <p className="text-muted m-b-20">A secret link will be sent to your email address. Clicking it will log you in.</p>
                    <form className="form-horizontal m-b-20">
                        <div className="form-group">
                            <label className="col-md-12">Email address</label>
                            <div className="col-md-12">
                                <input type="email" name="email" className="form-control" />
                            </div>
                        </div>
                        <button className="btn btn-outline btn-primary fcbtn btn-1e btn-lg btn-block waves-effect">Send Link</button>
                    </form>

                    <a href="/login">Back to Social Login</a>
                </div>
            </div>
        </div>;
    }
};