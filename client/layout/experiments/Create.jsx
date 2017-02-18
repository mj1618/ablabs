import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';
import Promise from 'bluebird';
import 'whatwg-fetch';
import CreateEventModal from '../events/CreateModal.jsx';

const TextError = (props)=><div className="row">
                            <div className="col-md-12 text-center m-t-20 text-danger">
                                {props.error}
                            </div>
                        </div>;

export default class Create extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: pageData.experimentName || "",
            description: pageData.experimentDescription || "",
            showEventsDropdown: false,
            cohort: pageData.cohort || 90,
            filteredEvents:[],
            variations: pageData.variations || [
                {
                    name: "Variation 1",
                    description: "",
                    cohort: 50
                },
                {
                    name: "Variation 2",
                    description: "",
                    cohort: 50
                }
            ],
            events: pageData.events,
            selectedEvents: pageData.selectedEvents ||  [],
            errorsTriggered: false
        };
    }

    componentDidMount(){
        this.filterEvents();
    }

    addVariation(){

        const variations = this.state.variations.concat({
            name: "Variation "+(this.state.variations.length+1),
            description: "",
            cohort: 0
        });

        variations.forEach(v=>{
            v.cohort = Math.floor( 100 / variations.length )
        });

        this.setState({
            variations
        });
        return false;
    }

    removeVariation(i){
        if(this.state.variations.length>2){
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
            icon: 'warning',
            hideAfter: 2000,
            stack: 6
        });
    }

    checkErrors(){
        let errors={};
        if(this.state.name.length===0){
            errors.name='You must enter a name for the experiment';
        }
        // if(this.state.cohort<=0 || this.state.cohort>100){
        //     errors.cohort='Cohort must be a number from 1 to 100';
        // }
        if(this.state.variations.length<2){
            errors.variations='You must have at least two variations: A and B';
        } else if (this.state.variations.some(v=>v.name.length===0 || v.cohort<=0 || v.cohort>100)){
            errors.variations='Please enter a name and a cohort percentage for all your variations';
        } else if (this.state.variations.some(v => this.state.variations.some(v2=>v!==v2 && v2.name===v.name) )){
            errors.variations='Each variation must have a unique name';
        } else if(this.state.variations.reduce((a,v)=>a+v.cohort,0) > 100){
            errors.variations='Variations must add up to less than or equal to 100';
        } else if(this.state.variations.some(v=>v.cohort<=0)){
            errors.variations='Variations must have a positive cohort percentage';
        }
        if(this.state.selectedEvents.length===0){
            errors.events='You must select at least 1 event to use in the experiment';
        }

        return errors;
    }

    submit(){
        const errors = this.checkErrors();
        this.setState({errorsTriggered:true});
        if(Object.keys(errors).length===0){
            fetch('/experiments/create', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
            .then(res=>res.json())
            .then(json=>{
                console.log(json);
            })
        }
    }

    setVariationData(i, data){
        this.setState({
            variations: this.state.variations.map((v,j)=>{
                if(i===j){
                    return Object.assign({}, v, data);
                } else {
                    return v;
                }
            })
        });
    }

    render() {
        const errors = this.checkErrors();
        return <div className="row">
            <div className="col-lg-8 col-lg-push-2">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Create a New Experiment </h3>
                    <p className="text-muted m-b-30 font-13">An experiment is the basis for an AB test. You define what your variations are and what percentage of users to target.</p>
                    <div className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12">Experiment Name</label>
                            <div className="col-md-12">
                                <input 
                                    onChange={e=>this.setState({name:e.target.value})}
                                    value={this.state.name} 
                                    type="text" 
                                    name="name" 
                                    className="form-control" />
                                {
                                    this.state.errorsTriggered && 
                                    errors.name && 
                                    <TextError error={errors.name} />
                                }
                            </div>

                            
                        </div>

                        <div className="form-group">
                            <label className="col-md-12">Description</label>
                            <div className="col-md-12">
                                <textarea 
                                    onChange={e=>this.setState({description:e.target.value})}
                                    value={this.state.description} 
                                    className="form-control" 
                                    rows="5"></textarea>
                            </div>

                            {
                                
                                this.state.errorsTriggered && 
                                errors.description && 
                                <div className="help-block with-errors">
                                    <ul className="list-unstyled">
                                        <li>{errors.description}</li>
                                    </ul>
                                </div>
                            }
                        </div>

                        {/*<div className="form-group">
                            <label className="col-md-12">Cohort</label>
                            <div className="col-md-3">
                                <input 
                                    type="number"
                                    onChange={e=>this.setState({cohort:Math.max(1,Math.min(100,e.target.value))})}
                                    value={this.state.cohort} 
                                    className="form-control" 
                                    style={{maxWidth:'80px', textAlign:'right', display:'inline'}} />
                                <span> %</span>
                            </div>

                            {
                                this.state.errorsTriggered && 
                                errors.cohort && <TextError error={errors.cohort} />
                            }
                        </div>*/}

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
                                                    return <tr id={"variation-"+i} key={i}>
                                                        <td>
                                                            <input 
                                                                value={v.name}
                                                                onChange={e=>this.setVariationData(i,{
                                                                    'name':e.target.value
                                                                })}
                                                                type="text" 
                                                                value={v.name} 
                                                                className="form-control"/>
                                                        </td>
                                                        <td>
                                                            <input
                                                                value={v.name}
                                                                onChange={e=>this.setVariationData(i,{
                                                                    'description':e.target.value
                                                                })} 
                                                                type="text" 
                                                                value={v.description} 
                                                                className="form-control"/>
                                                        </td>
                                                        <td>
                                                            <input
                                                                value={v.name}
                                                                onChange={e=>this.setVariationData(i,{
                                                                    cohort: Math.max( 1, Math.min( 100, e.target.value ))
                                                                })}
                                                                type="number" 
                                                                value={v.cohort} 
                                                                className="form-control"/>
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

                            {
                                this.state.errorsTriggered && 
                                errors.variations && <TextError error={errors.variations} />
                            }
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
                                            <div className={"list-group " + (this.state.showEventsDropdown===true?'':'')} style={{maxHeight:'206px', marginTop:'-1px', overflow:'scroll', borderBottom:'1px solid #ddd', boxShadow: "0 1px 4px 0 rgba(0,0,0,.1)"}} >
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
                                            { this.state.selectedEvents.length===0 && <p>No events added yet.<br/>Select one from the list or create a new event.</p> }
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
                                        <p>You don't have any events for your project. <br />Please create one to use in this experiment.</p>
                                    </div>
                            }
                            {
                                this.state.errorsTriggered && 
                                errors.events && 
                                <TextError error={errors.events} />
                            }

                        </div>

                        <hr />

                        <div className="row">

                            <div className="col-md-4 col-md-push-4">
                                <button onClick={()=>this.submit()} type="button" className="btn fcbtn btn-1e btn-lg btn-block btn-outline btn-primary waves-effect">Save Experiment</button>
                            </div>
                        </div>

                        { 
                            this.state.errorsTriggered && 
                            Object.keys(errors).length>0 && 
                            <TextError error="Please fix the above form errors before submitting" /> 
                        }

                    </div>
                </div>
            </div>
        </div>;
    }
};