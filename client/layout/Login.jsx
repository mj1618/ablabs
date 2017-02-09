import React from 'react';
import {State, Actions, Component, Render} from 'jumpsuit';


export default Component({
    render(){
        return <div className="lc-block toggled" id="l-login">
                <div className="lcb-form">
                    <button className="btn btn-default btn-block waves-effect" style={{background: "url('/images/btn_google_signin_light_normal_web.png')"}}>
                        <i className="zmdi zmdi-google"></i>
                        Login with Google
                    </button>
                </div>
            </div>;
    }
});