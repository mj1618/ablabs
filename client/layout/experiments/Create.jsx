import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';

export default class Create extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            description: "",
            showEventsDropdown: false,
            cohort: 90,
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
            events: [
                {
                    name: 'revenue'
                },
                {
                    name: 'hits'
                },
                {
                    name: 'revenue'
                },
                {
                    name: 'hits'
                },
                {
                    name: 'revenue'
                },
                {
                    name: 'hits'
                },
                {
                    name: 'revenue'
                },
                {
                    name: 'hits'
                },
                {
                    name: 'revenue'
                },
                {
                    name: 'hits'
                }
            ],
            selectedEvents: []
        };
    }

    componentDidMount(){
        this.searchEvents.focus();
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

    render() {
        return <div className="row">
            <div className="col-lg-8 col-lg-push-2">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Create a New Experiment </h3>
                    <p className="text-muted m-b-30 font-13">An experiment is the basis for an AB test. You define what your variations are and what percentage of users to target.</p>
                    <form className="form-horizontal">
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

                        <div className="form-group">
                            <label className="col-md-12">Variations</label>
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table">
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
                                    <button type="button" className="btn btn-info waves-effect pull-right" onClick={()=>this.addVariation()}>Add Variation</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-12">Events</label>
                            <div className="col-md-6">
                                { this.state.selectedEvents.length===0 && <p>No events added yet.</p> }
                                {
                                    this.state.selectedEvents.map((e,i)=>{
                                        return <button style={{margin:'5px'}} key={i} type="button" onClick={()=>this.toggleEvent(e)} className="btn btn-outline btn-rounded btn-info waves-effect">{e.name} <i className="fa fa-times m-l-5" /></button>
                                    })
                                }
                            </div>
                            <div className="col-md-6"  onFocus={ ()=>this.onSearchEventsFocus() } onBlur={ (e)=>this.onSearchEventsBlur(e) }>
                                <input onChange={()=>this.forceUpdate()} ref={(input) => { this.searchEvents = input; }}  type="text" className="form-control" placeholder="Search events..." />
                                <div className={"list-group " + (this.state.showEventsDropdown===true?'':'invisible')} style={{maxHeight:'206px',overflow:'scroll'}}>
                                    {
                                        this.state.events.filter(e=>e.name.startsWith(this.searchEvents?this.searchEvents.value:'')).map((e,i)=>{
                                            return <a key={i} onClick={()=>this.toggleEvent(e)} href="javascript:void(0)" className={"list-group-item "+(this.state.selectedEvents.indexOf(e)>=0?'active':'')}>{e.name}</a>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>;
    }
};