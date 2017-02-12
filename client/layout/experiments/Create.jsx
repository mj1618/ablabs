import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';
import Promise from 'bluebird';
import 'whatwg-fetch';


class CreateEventModal extends React.Component {
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
                  <div className="modal-body">
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

export default class Create extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            description: "",
            showEventsDropdown: false,
            cohort: 90,
            filteredEvents:[],
            variations: [
                {
                    name: "Variation 1",
                    description: "",
                    percent: 50
                },
                {
                    name: "Variation 2",
                    description: "",
                    percent: 50
                }
            ],
            events: [],
            selectedEvents: []
        };
    }

    componentDidMount(){
        this.filterEvents();
    }

    addVariation(){
        this.setState({
            variations: this.state.variations.concat({
                name: "Variation "+(this.state.variations.length+1),
                description: "",
                percent: 0
            })
        });
        return false;
    }

    removeVariation(i){
        if(this.state.variations.length>1){
            this.setState({
                variations: this.state.variations.filter((v,j)=>j!==i)
            });
        }
        return false;
    }

    onSearchEventsFocus(){
        this.setState({
            showEventsDropdown: true
        });
    }

    onSearchEventsBlur(e){
        if (!focusInCurrentTarget(e)) {
            console.log('table blurred');
            this.setState({
                showEventsDropdown: false
            });
        }
    }

    filterEvents(){
        this.setState({
            filteredEvents: this.state.events.filter(e=>e.name.startsWith(this.searchEvents?this.searchEvents.value:''))
        });
    }

    toggleEvent(e){
        if(this.state.selectedEvents.indexOf(e)>=0){
            this.setState({
                selectedEvents: this.state.selectedEvents.filter((es)=>es!==e)
            });
        } else {
            this.setState({
                selectedEvents: this.state.selectedEvents.concat(e)
            });
        }
    }

    eventCreated(e){
        this.setState({
            events: this.state.events.concat(e),
            selectedEvents: this.state.selectedEvents.concat(e),
            filteredEvents: this.state.events.concat(e).filter(e=>e.name.startsWith(this.searchEvents?this.searchEvents.value:''))
        });

        $.toast({
            heading: 'Event created',
            text: '',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'success',
            hideAfter: 2000,
            stack: 6
        });
    }

    eventCreationFailed(){
        $.toast({
            heading: 'Event failed to create',
            text: '',
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'warning',
            hideAfter: 2000,
            stack: 6
        });
    }

    render() {
        return <div className="row">
            <div className="col-lg-8 col-lg-push-2">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Create a New Experiment </h3>
                    <p className="text-muted m-b-30 font-13">An experiment is the basis for an AB test. You define what your variations are and what percentage of users to target.</p>
                    <div className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12">Experiment Name</label>
                            <div className="col-md-12">
                                <input type="text" name="name" className="form-control" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-12">Description</label>
                            <div className="col-md-12">
                                <textarea className="form-control" rows="5"></textarea>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-12">Cohort</label>
                            <div className="col-md-3">
                                <input type="number" name="cohort" defaultValue={90} className="form-control" style={{maxWidth:'80px', textAlign:'right', display:'inline'}} /><span> %</span>
                            </div>
                        </div>

                        <hr />

                        <div className="form-group">
                            <label className="col-md-12">Variations</label>
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table color-table muted-table table-borderless">
                                        <thead>
                                            <tr>
                                                <th className="small">Name</th>
                                                <th className="small">Description</th>
                                                <th className="small" style={{width:'80px'}}>Cohort %</th>
                                                <th className="small" style={{width:'40px'}}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.variations.map((v,i)=>{
                                                    return <tr key={i}>
                                                        <td>
                                                            <input type="text" value={v.name} className="form-control"/>
                                                        </td>
                                                        <td>
                                                            <input type="text" value={v.description} className="form-control"/>
                                                        </td>
                                                        <td>
                                                            <input type="number" value={v.percent} className="form-control"/>
                                                        </td>
                                                        <td>
                                                            <button type="button" onClick={()=>this.removeVariation(i)} className="btn btn-danger btn-circle waves-effect"><i className="fa fa-minus"></i> </button>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <button type="button" className="btn btn-success waves-effect btn-outline pull-right" onClick={()=>this.addVariation()}>Add Variation</button>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="form-group">
                            <div className="col-md-12">
                                <label>Events</label>
                                <button type="button" data-toggle="modal" data-target="#createEventModal" className="btn btn-success btn-outline waves-effect pull-right m-b-10">New Event</button>
                                <CreateEventModal success={e=>this.eventCreated(e)} fail={()=>this.eventCreationFailed()} />
                            </div>

                            {
                                this.state.events.length>0 &&
                                    <div className="row">
                                        <div className="col-md-6" onFocus={ ()=>this.onSearchEventsFocus() } onBlur={ (e)=>this.onSearchEventsBlur(e) }>
                                        
                                            <input onChange={()=>this.filterEvents()} ref={(input) => { this.searchEvents = input; }}  type="text" className="form-control" placeholder="Search events..." />
                                            <div className={"list-group " + (this.state.showEventsDropdown===true?'':'')} style={{maxHeight:'206px',overflow:'scroll', borderBottom:'1px solid #ddd', boxShadow: "0 1px 4px 0 rgba(0,0,0,.1)"}} >
                                                {
                                                    this.state.filteredEvents.map((e,i)=>{
                                                        return <a 
                                                            key={i} 
                                                            onClick={()=>this.toggleEvent(e)} 
                                                            href="javascript:void(0)" 
                                                            className={"list-group-item "+(this.state.selectedEvents.indexOf(e)>=0?'active':'')}>
                                                                {e.name}
                                                                <i className={"pull-right fa "+(this.state.selectedEvents.indexOf(e)>=0?'fa-minus':'fa-plus')} />
                                                            </a>
                                                    })
                                                }
                                            </div>
                                        </div>

                                        <div className="col-md-6" style={{marginBottom:'10px'}}>
                                            { this.state.selectedEvents.length===0 && <p>No events added yet.</p> }
                                            {
                                                this.state.selectedEvents.map((e,i)=>{
                                                    return <button style={{margin:'5px'}} key={i} type="button" onClick={()=>this.toggleEvent(e)} className="btn btn-outline btn-rounded btn-info waves-effect">{e.name} <i className="fa fa-times m-l-5" /></button>
                                                })
                                            }
                                            
                                        </div>
                                    </div>
                            }

                            {
                                this.state.events.length===0 &&
                                    <div className="col-md-12 text-center">
                                        <p>You have not created an event in this project yet, please create one to use in this experiment.</p>
                                    </div>
                            }

                        </div>

                        <hr />

                        <div className="row">

                            <div className="col-md-4 col-md-push-4">
                                <button type="button" className="btn fcbtn btn-1e btn-lg btn-block btn-outline btn-primary waves-effect">Save Experiment</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>;
    }
};