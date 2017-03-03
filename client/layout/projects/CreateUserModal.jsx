import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';
import Promise from 'bluebird';
import 'whatwg-fetch';

export default class CreateUserModal extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        $('#createUserModal').on('shown.bs.modal', ()=>this.email.value='');
        $('#createUserModal').on('hidden.bs.modal', ()=>this.email.value='');
    }
    saveUser(){
        fetch('/collaborators/add', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.email.value,
                role: this.role.value
            })
        })
        .then(res=>res.json())
        .then(json=>{
            if(json.result==='success'){
                if(this.props.success){
                    this.props.success(json.email, json.role);
                }
            } else {
                if(this.props.fail){
                    this.props.fail();
                }
            }
            $('#createUserModal').modal('hide');
        })
        .catch((e)=>{
            console.error(e);
            if(this.props.fail){
                this.props.fail();
            }
            $('#createUserModal').modal('hide');
        });
    }
    render(){
        return <div id="createUserModal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="createUserLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 className="modal-title" id="createUserLabel">Add a New Collaborator</h4>
                  </div>
                  <div className="modal-body form-horizontal">
                    <div className="form-group">
                        <label className="col-md-12">User Email</label>
                        <div className="col-md-12">
                            <input type="text" ref={i=>this.email=i} name="email" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-12">Role</label>
                        <div className="col-md-12">
                            <select ref={i=>this.role=i} name="role" className="form-control">
                                <option name="viewer">Viewer</option>
                                <option name="editor">Editor</option>
                            </select>
                        </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary waves-effect" onClick={()=>this.saveUser()}>Save</button>
                  </div>
                </div>
              </div>
            </div>
    }
}
