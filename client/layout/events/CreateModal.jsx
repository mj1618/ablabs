import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';
import Promise from 'bluebird';
import 'whatwg-fetch';

export default class CreateEventModal extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        $('#createEventModal').on('shown.bs.modal', ()=>this.eventName.value='');
        $('#createEventModal').on('hidden.bs.modal', ()=>this.eventName.value='');
    }
    saveEvent(){
        fetch('/events/create', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.eventName.value
            })
        }).then(res=>res.json())
        .then(json=>{
            if(json.result==='success'){
                if(this.props.success){
                    this.props.success(json.event);
                }
            } else {
                if(this.props.fail){
                    this.props.fail();
                }
            }
            $('#createEventModal').modal('hide');
        }).catch((e)=>{
            console.error(e);
            if(this.props.fail){
                this.props.fail();
            }
            $('#createEventModal').modal('hide');
        });
    }
    render(){
        return <div id="createEventModal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="createEventLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 className="modal-title" id="createEventLabel">Create a New Event</h4>
                  </div>
                  <div className="modal-body form-horizontal">
                    <div className="form-group">
                        <label className="col-md-12">Event Name</label>
                        <div className="col-md-12">
                            <input type="text" ref={i=>this.eventName=i} name="event-name" className="form-control" />
                        </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary waves-effect" onClick={()=>this.saveEvent()}>Save</button>
                  </div>
                </div>
              </div>
            </div>
    }
}
