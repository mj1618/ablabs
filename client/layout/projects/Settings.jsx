import React from 'react';
import {TabMenu, TabMenuItem, TabContent, TabPanel} from '../../tabs/index';

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

                    <TabMenu>
                        <TabMenuItem id='integration' name='Integration' icon='zmdi zmdi-layers' first={true} />
                        <TabMenuItem id='collaborators' name='Collaborators' icon='zmdi zmdi-person' />
                    </TabMenu>
                    <TabContent>
                        <TabPanel id='integration' first={true}>
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
                        </TabPanel>
                        <TabPanel id='collaborators'>
                            <Collaborators />
                            <div className="clearfix"></div>
                        </TabPanel>
                    </TabContent>
                </div>
            </div>
        </div>;
    }
};