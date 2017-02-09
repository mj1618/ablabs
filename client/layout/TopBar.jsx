import React from 'react';
import {State, Actions, Component, Render} from 'jumpsuit';


export default Component({
    render(){
        return <nav className="navbar navbar-default navbar-static-top m-b-0">
        <div className="navbar-header"> <a className="navbar-toggle hidden-sm hidden-md hidden-lg " href="javascript:void(0)" data-toggle="collapse" data-target=".navbar-collapse"><i className="ti-menu"></i></a>
          <div className="top-left-part"><a className="logo" href="index.html"><b><img src="../plugins/images/eliteadmin-logo.png" alt="home" /></b><span className="hidden-xs"><img src="../plugins/images/eliteadmin-text.png" alt="home" /></span></a></div>
          
            <ul className="nav navbar-top-links navbar-left hidden-xs">
              <li><a href="javascript:void(0)" className="open-close hidden-xs waves-effect waves-light"><i className="icon-arrow-left-circle ti-menu"></i></a></li>
              
            </ul>
            <ul className="nav navbar-top-links navbar-right pull-right">
            </ul>
        </div>
      </nav>;
    }
});