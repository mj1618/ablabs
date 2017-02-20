import React from 'react';
import Promise from 'bluebird';
import 'whatwg-fetch';

export default class Table extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            experiments: pageData.experiments,
            toggling: pageData.experiments.map(()=>false)
        };
    }

    toggleActive(i){
        if(this.state.toggling[i]===true){
            return true;
        }
        this.setState({
            toggling: this.state.toggling.map((t,j)=>{
                if(j===i){
                    return true;
                } else {
                    return t;
                }
            })
        });
        fetch(`/experiments/${this.state.experiments[i].id}/toggle`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>res.json())
        .then(json=>{
            this.setState({
                experiments: this.state.experiments.map((exp,j)=>{
                    if(j===i){
                        return Object.assign({},exp, {active:json.active});
                    } else {
                        return exp;
                    }
                }),
                toggling: this.state.toggling.map((t,j)=>{
                    if(j===i){
                        return false;
                    } else {
                        return t;
                    }
                })
            })  
        }).catch(e=>{
            console.error(e);
            this.setState({
                toggling: this.state.toggling.map((t,j)=>{
                    if(j===i){
                        return false;
                    } else {
                        return t;
                    }
                })
            })  
        });
    }

    render(){
        return <div className="row">
        <div className="col-lg-12">
          <div className="white-box">
            <a href="/experiments/create" className="fcbtn btn btn-primary btn-outline btn-1e waves-effect pull-right">Create Experiment</a>
            <h3 className="box-title m-b-0">Experiments </h3>
            <p className="text-muted m-b-20">Click on an experiment to view and edit</p>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Experiment</th>
                    <th>Cohort %</th>
                    <th># Unique Users</th>
                    <th># Tracked Events</th>
                    <th>Active</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                    {
                        this.state.experiments.length===0 && <tr>
                                <td colSpan={5} style={{textAlign:'center'}}>
                                    You have no experiments
                                </td>
                            </tr>
                    }
                    {
                        this.state.experiments.map((exp,i) => {
                            return <tr key={i}>
                                <td><a href={`/experiments/${exp.id}/view`}>{exp.name}</a></td>
                                <td>{exp.cohort}%</td>
                                <td>{exp.nUsers}</td>
                                <td>{exp.nTracks}</td>
                                { this.state.toggling[i]===true && <td><div className="btn btn-sm btn-default btn-rounded" style={{color:'black',width:'80px',cursor:'default'}}><i className="fa fa-spinner fa-spin"/></div></td>}
                                { this.state.toggling[i]!==true && exp.active===1 && <td><div className="btn btn-sm btn-success btn-rounded" style={{width:'80px'}} onClick={()=>this.toggleActive(i)}>Active</div></td> }
                                { this.state.toggling[i]!==true && exp.active!==1 && <td><div className="btn btn-sm btn-warning btn-rounded" style={{width:'80px'}} onClick={()=>this.toggleActive(i)}>Paused</div></td> }
                                <td>
                                    <a href={`/experiments/${exp.id}/edit`} data-toggle="tooltip" data-original-title="Edit"> 
                                        <i className="fa fa-pencil text-inverse m-r-10"></i> 
                                    </a>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>;
    }
};
