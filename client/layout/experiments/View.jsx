import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';
import Promise from 'bluebird';
import 'whatwg-fetch';

class BarGraph extends React.Component {
    componentDidMount(){
        Morris.Bar({
            element: 'variation-chart',
            data: pageData.values,
            xkey: 'variation',
            ykeys: pageData.experiment.events.map(e=>e.name),
            labels: pageData.experiment.events.map(e=>e.name),
            barColors:['#b8edf0', '#b4c1d7', '#fcc9ba'],
            hideHover: 'auto',
            gridLineColor: '#eef0f2',
            resize: true
        });
    }
    render() {
        return <div className="row">
            <div className="col-lg-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Experiment Report</h3>
                    <p className="text-muted m-b-30 font-13"></p>
                    <div id="variation-chart"></div>
                </div>
            </div>
        </div>;
    }
};


class Analysis extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            baseline: pageData.values[0],
            values: pageData.values,
            experiment: pageData.experiment
        };
    }
    getPercentage(v,event){
        const r = Number(100.0 * v[event.name] / this.state.baseline[event.name] - 100).toFixed(1);
        if(r>0){
            return <span className="text-success">+{r}%</span>;
        } else if(r<0){
            return <span className="text-danger">{r}%</span>;
        } else {
            return <span className="">{r}%</span>;
        }
    }
    changeBaseline(name){
        console.log('change baseline: '+name);
        this.setState({
            baseline: this.state.values.find(v=>v.variation===name)
        });
    }
    render() {
        const baseline = this.state.baseline;
        return <div className="row">
            <div className="col-lg-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Experiment Analysis</h3>
                    <p className="text-muted m-b-30 font-13"></p>
                    <div className="row">
                    <div className="btn-group col-md-12">
                        <div className="pull-right">
                            <button aria-expanded="false" data-toggle="dropdown" className="btn btn-info dropdown-toggle waves-effect waves-light" type="button">Baseline: {this.state.baseline.variation} <span className="caret"></span></button>
                            <ul role="menu" className="dropdown-menu">
                                {
                                    this.state.values.filter(v=>v!==this.state.baseline).map((v,i)=>{
                                        return <li key={i}><a href="javascript:void(0)" onClick={()=>this.changeBaseline(v.variation)}>{v.variation}</a></li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    </div>
                    <div className="row">

                    <div className="table-responsive col-md-12">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Variation</th>
                                {
                                    pageData.experiment.events.map((e,i)=>{
                                        return <th key={i}>{e.name}</th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.values.length===0 && <tr>
                                            <td colSpan={5} style={{textAlign:'center'}}>
                                                You have no data
                                            </td>
                                        </tr>
                                }
                                {
                                    this.state.values.filter(v=>v===this.state.baseline).map((v,i) => <tr key={i}>
                                            <td>{v.variation}</td>
                                            {
                                                pageData.experiment.events.map((event,i) => <td key={i}>
                                                        {this.getPercentage(v,event)}
                                                        <br/><small>{v[event.name]}</small>
                                                    </td>
                                                )
                                            }
                                        </tr>
                                    )
                                }
                                {
                                    this.state.values.filter(v=>v!==this.state.baseline).map((v,i) => <tr key={i}>
                                            <td>{v.variation}</td>
                                            {
                                                pageData.experiment.events.map((event,i) => <td key={i}>
                                                        {this.getPercentage(v,event)}
                                                        <br/><small>{v[event.name]}</small>
                                                    </td>
                                                )
                                            }
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    </div>
                </div>
            </div>
        </div>;
    }
};


export default class View extends React.Component {

    render() {
        return <div>
                <Analysis />
                <BarGraph />
            </div>
    }
};