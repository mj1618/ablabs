import React from 'react';

export default class Menu extends React.Component {
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
        {/*<li className="user-pro"> 
            <a href="#none" className="waves-effect">
                <i className="zmdi zmdi-face zmdi-hc-fw" style={{fontSize:'28px',verticalAlign:'middle'}} />
                <span className="hide-menu"> Account Settings<span className="fa arrow"></span></span>
            </a>
          <ul className="nav nav-second-level">
            <li><a href="javascript:void(0)"><i className="ti-user"></i> Your Profile</a></li>
            <li><a href="javascript:void(0)"><i className="fa fa-power-off"></i> Logout</a></li>
          </ul>
        </li>*/}
        <li className="nav-small-cap m-t-10">--- Project Menu</li>
        <li> 
            <a href="/experiments" className="waves-effect">
                <i className="zmdi zmdi-view-dashboard zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Experiments
                    <span className="label label-rouded label-custom pull-right">{pageData.nExperiments}</span>
                </span>
            </a>
        </li>
        <li> 
            <a href="/events" className="waves-effect">
                <i className="zmdi zmdi-chart zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Events
                    <span className="label label-rouded label-info pull-right">{pageData.nEvents}</span>
                </span>
            </a>
        </li>
        <li> 
            <a href="/developer" className="waves-effect">
                <i className="zmdi zmdi-code zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Developer
                </span>
            </a>
        </li>
        <li className="nav-small-cap m-t-10">--- Manage Projects</li>

        <li> 
            <a href="/settings" className="waves-effect">
                <i className="zmdi zmdi-settings zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Project Settings
                </span>
            </a>
        </li>
        <li> 
            <a href="javascript:void(0)" className="waves-effect">
                <i className=" zmdi zmdi-swap zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Switch Project<span className="fa arrow"></span>
                    <span className="label label-rouded label-purple pull-right">{pageData.nProjects}</span>
                </span>
            </a>
            <ul className="nav nav-second-level collapse" aria-expanded="false">
                {
                    pageData.projects.map((p,i)=>{
                        return <li key={i}> <a href={`/switch-project/${p.id}`}>{p.name}</a> </li>
                    })
                }
            </ul>
        </li>
        <li> 
            <a href="/create-project" className="waves-effect">
                <i className="zmdi zmdi-plus-circle zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Create Project
                </span>
            </a>
        </li>

        <li className="nav-small-cap m-t-10">--- Support</li>
        <li> 
            <a href="mailto:info@ablabs.io" className="waves-effect">
                <i className="zmdi  zmdi zmdi-comment-text zmdi-hc-fw fa-fw" ></i> 
                <span className="hide-menu"> 
                    Contact Us
                </span>
            </a>
        </li>

      </ul>
    </div>
  </div>;
    }
};