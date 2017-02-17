import React from 'react';

export default class TopBar extends React.Component {
    render(){
        const leftStyles = {height:'60px'};
        if(pageData.showMenu===false){
          leftStyles.position='absolute';
        }
        return <nav className="navbar navbar-default navbar-static-top m-b-0">
        <div className="navbar-header"> 
          {pageData.showMenu && <a className="navbar-toggle hidden-sm hidden-md hidden-lg " href="javascript:void(0)" data-toggle="collapse" data-target=".navbar-collapse"><i className="ti-menu"></i></a> }
          <div className="top-left-part" style={leftStyles}>
            {/*<a className="logo" href="index.html"><b><img src="../plugins/images/eliteadmin-logo.png" alt="home" /></b><span className="hidden-xs"><img src="../plugins/images/eliteadmin-text.png" alt="home" /></span></a>*/}
            <h1 id="logo-large" className='text-center' style={{color:'white'}}><b>ab</b>Labs</h1>
            <h1 id="logo-small" className='text-center' style={{color:'white'}}><b>ab</b></h1>
          </div>
          
            <ul className="nav navbar-top-links navbar-left hidden-xs">
              <li><a href="javascript:void(0)" className="open-close hidden-xs waves-effect waves-light">{ pageData.showMenu && <i className="icon-arrow-left-circle ti-menu"></i> }</a></li>
              { pageData.showSearch && <li className="in">
                <form role="search" className="app-search hidden-xs">
                    <input type="text" placeholder="Search..." className="form-control" />
                    <a href="" className="active"><i className="fa fa-search"></i></a>
                </form>
                </li>
              }
            </ul>
            <ul className="nav navbar-top-links navbar-right pull-right">
                { pageData.showNotifications && <li className="dropdown"> 
                    <a className="dropdown-toggle waves-effect waves-light" data-toggle="dropdown" href="#">
                        <i className="icon-envelope"></i>
                        {/*<div className="notify"><span className="heartbit"></span><span className="point"></span></div>*/}
                    </a>
                    <ul className="dropdown-menu mailbox scale-up">
                        <li>
                            <div className="drop-title">You have no new notifications</div>
                        </li>
                    </ul>
                </li> }

                { pageData.showAccount && <li className="dropdown"> 
                    <a className="dropdown-toggle waves-effect profile-pic" data-toggle="dropdown" href="#"> 
                        <i className="zmdi zmdi-face zmdi-hc-fw" style={{fontSize:'28px',verticalAlign:'middle'}} />
                        <b className="hidden-xs">Your Account</b>
                    </a>
                    <ul className="dropdown-menu dropdown-user scale-up">
                        <li><a href="#"><i className="ti-user"></i> Account Settings</a></li>
                        <li><a href="#"><i className="fa fa-power-off"></i> Logout</a></li>
                    </ul>
                </li> }
            </ul>
        </div>
      </nav>;
    }
};