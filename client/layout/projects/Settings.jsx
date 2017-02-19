import React from 'react';

class Collaborators extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: pageData.users
        };
    }
    render(){
        return <div>
                <button type="button" data-toggle="modal" data-target="#addUserModal" className="fcbtn btn btn-primary btn-outline btn-1e waves-effect pull-right">Add User</button>
                
                <div className="table-responsive col-md-12">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.length===0 && <tr>
                                        <td colSpan={4} style={{textAlign:'center'}}>
                                            You have no collaborators
                                        </td>
                                    </tr>
                            }
                            {
                                this.state.users.map((u,i) => {
                                    return <tr key={i}>
                                        <td>{u.first_name} {u.last_name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        <td>
                                            <a href="#" data-toggle="tooltip" data-original-title="Edit"> 
                                                <i className="fa fa-pencil text-inverse m-r-10"></i> 
                                            </a>
                                            <a href="#" data-toggle="tooltip" data-original-title="Remove">
                                                <i className="fa fa-close text-warning"></i>
                                            </a>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>;
    }
}

export default class Settings extends React.Component {
    copyToken(){
        this.tokenInput.select();
        document.execCommand('copy');
        $.toast({
            heading: 'Token Copied',
            text: '',
            position: 'top-right',
            icon: 'success',
            hideAfter: 2000,
            stack: 6
        });
    }
    render(){
        return <div className="row">
            <div className="col-lg-8 col-lg-push-2">
                <div className="white-box">
                    <h3 className="box-title m-b-0">{pageData.projectName} Settings</h3>
                    {/*<p className="text-muted m-b-30 font-13"></p>*/}
                    <ul className="nav customtab nav-tabs" role="tablist">
                        <li role="presentation" className="active">
                            <a href="#integration" aria-controls="integration" role="tab" data-toggle="tab" aria-expanded="true">
                                <span className="visible-xs">
                                    <i className="zmdi zmdi-layers"></i>
                                </span>
                                <span className="hidden-xs"> Integration</span>
                            </a>
                        </li>
                        <li role="presentation" className="">
                            <a href="#collaborators" aria-controls="collaborators" role="tab" data-toggle="tab" aria-expanded="true">
                                <span className="visible-xs">
                                    <i className="zmdi zmdi-layers"></i>
                                </span>
                                <span className="hidden-xs"> Collaborators</span>
                            </a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane fade active in" id="integration">
                            <div className="modal-body form-horizontal">
                                <div className="form-group col-md-12">
                                    <label className="control-label">Project API Token</label>
                                    <div className="input-group">
                                        <div className="input-group-btn">
                                            <input readOnly ref={i=>this.tokenInput=i} type="text" value={pageData.token} name="token" className="form-control"/>
                                            <button onClick={()=>this.copyToken()} type="button" className="btn waves-effect waves-light btn-info"><i className="fa fa-copy"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="collaborators">
                            <Collaborators />
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>;
    }
};