import React from 'react';
import {TabMenu, TabMenuItem, TabContent, TabPanel} from '../../tabs/index';
import CreateUserModal from './CreateUserModal.jsx';

export default class Collaborators extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            collaborators: pageData.collaborators
        };
    }
    addUser(data){
        this.setState({
            collaborators: this.state.collaborators.concat([data])
        })
        $.toast({
            heading: 'Collaborator added',
            text: '',
            position: 'top-right',
            icon: 'success',
            hideAfter: 2000,
            stack: 6
        });
    }
    fail(e){
        $.toast({
            heading: 'Failed to add collaborator',
            text: '',
            position: 'top-right',
            icon: 'warning',
            hideAfter: 2000,
            stack: 6
        });
    }
    remove(email){
        fetch('/collaborators/remove', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        })
        .then(res=>res.json())
        .then(()=>{
            this.setState({
                collaborators: this.state.collaborators.filter(c=>c.email!==email)
            });
            $.toast({
                heading: 'Collaborator removed: '+email,
                text: '',
                position: 'top-right',
                icon: 'success',
                hideAfter: 2000,
                stack: 6
            });
        }).catch(e=>{
            $.toast({
                heading: 'Failed to remove collaborator',
                text: '',
                position: 'top-right',
                icon: 'warning',
                hideAfter: 2000,
                stack: 6
            });
        });
    }
    render(){
        return <div>
                <div className="table-responsive col-md-12">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.collaborators.length===0 && <tr>
                                        <td colSpan={4} style={{textAlign:'center'}}>
                                            You have no collaborators
                                        </td>
                                    </tr>
                            }
                            {
                                this.state.collaborators.map((u,i) => {
                                    return <tr key={i}>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        {
                                            u.role!=='owner' &&
                                            <td>
                                                <a href="javascript:void(0)" data-toggle="tooltip" data-original-title="Edit"> 
                                                    <i className="fa fa-pencil text-inverse m-r-10"></i> 
                                                </a>
                                                <a href="javascript:void(0)" onClick={()=>this.remove(u.email)} data-toggle="tooltip" data-original-title="Remove">
                                                    <i className="fa fa-close text-warning"></i>
                                                </a>
                                            </td>
                                        }
                                        {
                                            u.role==='owner' &&
                                            <td></td>
                                        }
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                    <CreateUserModal success={(email,role)=>this.addUser({email,role})} fail={e=>this.fail(e)} />
                    <button type="button" data-toggle="modal" data-target="#createUserModal" className="fcbtn btn btn-primary btn-outline btn-1e waves-effect pull-right">Add User</button>
                </div>
            </div>;
    }
}
