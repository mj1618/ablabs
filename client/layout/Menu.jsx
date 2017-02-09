import React from 'react';
import {State, Actions, Component, Render} from 'jumpsuit';

export default Component({
    render(){
        return <div className="navbar-default sidebar" role="navigation">
    <div className="sidebar-nav navbar-collapse slimscrollsidebar">
       <ul className="nav" id="side-menu">
        <li className="sidebar-search hidden-sm hidden-md hidden-lg">
          <div className="input-group custom-search-form">
            <input type="text" className="form-control" placeholder="Search..." />
            <span className="input-group-btn">
            <button className="btn btn-default" type="button"> <i className="fa fa-search"></i> </button>
            </span> </div>
        </li>
        <li className="user-pro"> <a href="#" className="waves-effect"><img src="/plugins/images/varun.jpg" alt="user-img" className="img-circle invisible"/><span className="hide-menu"> Steve Gection<span className="fa arrow"></span></span></a>
          <ul className="nav nav-second-level">
            <li><a href="javascript:void(0)"><i className="ti-user"></i> My Profile</a></li>
            <li><a href="javascript:void(0)"><i className="ti-wallet"></i> My Balance</a></li>
            <li><a href="javascript:void(0)"><i className="ti-email"></i> Inbox</a></li>
            <li><a href="javascript:void(0)"><i className="ti-settings"></i> Account Setting</a></li>
            <li><a href="javascript:void(0)"><i className="fa fa-power-off"></i> Logout</a></li>
          </ul>
        </li>
        <li className="nav-small-cap m-t-10">--- Main Menu</li>
        <li> 
            <a href="/experiments" className="waves-effect active">
                <i className="zmdi zmdi-view-dashboard zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Experiments
                    <span className="label label-rouded label-custom pull-right">4</span>
                </span>
            </a>
        </li>
        <li> 
            <a href="/events" className="waves-effect">
                <i className="zmdi zmdi-chart zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Events
                </span>
            </a>
        </li>
        <li> 
            <a href="/api" className="waves-effect">
                <i className="zmdi zmdi-code zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Developer
                </span>
            </a>
        </li>
        <li> 
            <a href="/settings" className="waves-effect">
                <i className="zmdi zmdi-settings zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Settings
                </span>
            </a>
        </li>
      </ul>
    </div>
  </div>;
    }
});