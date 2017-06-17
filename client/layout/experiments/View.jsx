import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';
import Promise from 'bluebird';
import 'whatwg-fetch';
import {watch, unwatch} from 'watchjs';

let baseline;

class BaseLineValue extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        watch(baseline, ()=>this.forceUpdate() );
    }

    changeBaseline(name){
        console.log('change baseline: '+name);
        baseline.value = pageData.values.find(v=>v.variation===name);
    }

    render(){
        return <div className="btn-group col-md-12">
                    <div className="pull-right">
                        <button aria-expanded="false" data-toggle="dropdown" className="btn btn-info dropdown-toggle waves-effect waves-light" type="button">Baseline: {baseline.value.variation} <span className="caret"></span></button>
                        <ul role="menu" className="dropdown-menu">
                            {
                                pageData.values.filter(v=>v!==baseline.value.name).map((v,i)=>{
                                    return <li key={i}><a href="javascript:void(0)" onClick={()=>this.changeBaseline(v.variation)}>{v.variation}</a></li>
                                })
                            }
                        </ul>
                    </div>
                </div>;
    }
}


class BaseLineEvent extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        watch(baseline, ()=>this.forceUpdate() );
    }

    changeBaseline(e){
        console.log('change baseline: '+e.name);
        baseline.event = Object.assign({},e);
    }

    render(){
        return <div className="btn-group col-md-12">
                    <div className="pull-right">
                        <button aria-expanded="false" data-toggle="dropdown" className="btn btn-info dropdown-toggle waves-effect waves-light" type="button">Event: {baseline.event ? baseline.event.name : ''} <span className="caret"></span></button>
                        <ul role="menu" className="dropdown-menu">
                            {
                                pageData.experiment.events.filter(e=>e.id!==baseline.event.id).map((e,i)=>{
                                    return <li key={i}><a href="javascript:void(0)" onClick={()=>this.changeBaseline(e)}>{e.name}</a></li>
                                })
                            }
                        </ul>
                    </div>
                </div>;
    }
}

let line;
const colors = ['#00bfc7', '#fdc006', '#9675ce', '#fb9678', '#01c0c8', '#8698b7'];
class LineGraph extends React.Component {
    componentDidMount(){
        line = Morris.Line({
            parseTime:true,
            xkey: 'date',
            element: 'variation-line-chart',
            data: baseline.event ? pageData.lineChartValues[baseline.event.name] : [],
            ykeys: pageData.experiment.variations.map(v=>v.name),
            labels: pageData.experiment.variations.map(v=>v.name),
            lineColors:colors,
            hideHover: 'auto',
            gridLineColor: '#eef0f2',
            resize: true,
            hideHover: false,
            lineWidth: 1
        });
        watch(baseline, ()=>this.update() );
    }

    update(){
        console.log('name: '+baseline.event.name);
        line.setData(pageData.lineChartValues[baseline.event.name]);
    }

    render() {
        return <div className="row">
            <div className="col-lg-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Experiment Report</h3>
                    <BaseLineEvent />
                    <p className="text-muted m-b-30 font-13"></p>
                    <ul className="list-inline text-right">
                        {
                            pageData.experiment.variations.map((v,i)=>{
                                return <li key={i}>
                                    <h5><i className="fa fa-circle m-r-5" style={{color: colors[i%colors.length]}} ></i>{v.name}</h5>
                                </li>
                            })
                        }
                        
                    </ul>
                    <div id="variation-line-chart"></div>
                </div>
            </div>
        </div>;
    }
};


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
            values: pageData.values,
            experiment: pageData.experiment
        };
        if(!baseline){
            baseline = {
                value: pageData.values[0],
                event: pageData.experiment.events[0]
            }
        }
    }
    getPercentage(v,event){
        return Number( 100.0 * v[event.name] / pageData.assigns[v.variation] ).toFixed(1);
    }

    getSafePercentage(v,event){
        const p = this.getPercentage(v,event);
        if(isNaN(p)){
            return '-';
        } else {
            return p+'%';
        }
    }

    getDiffPercentage(v,event){
        const r = Number( 100.0 * (this.getPercentage(v,event)-this.getPercentage(baseline.value, event)) / this.getPercentage(baseline.value, event)).toFixed(1);
        if(r>0){
            return <span className="text-success">+{r}%</span>;
        } else if(r<0){
            return <span className="text-danger">{r}%</span>;
        } else if(r==0) {
            return <span className="">+{r}%</span>;
        } else {
            return <span className="">-</span>;
        }
    }
    componentDidMount(){
        watch(baseline, ()=>this.forceUpdate() );
    }
    render() {
        const base = baseline.value;
        return <div className="row">
            <div className="col-lg-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Experiment Analysis</h3>
                    <p className="text-muted m-b-30 font-13"></p>
                    <BaseLineValue />
                    <div className="row">
                        <div className="table-responsive col-md-12">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Variation</th>
                                    <th># Users</th>
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
                                        this.state.values.filter(v=>v===base).map((v,i) => <tr key={i}>
                                                <td style={{verticalAlign: 'middle'}}>{v.variation}</td>
                                                <td style={{verticalAlign: 'middle'}}>{pageData.assigns[v.variation]}</td>
                                                {
                                                    pageData.experiment.events.map((event,i) => <td key={i}>
                                                            -
                                                            <br/><span>{v[event.name]}, {this.getSafePercentage(v,event)}</span>
                                                        </td>
                                                    )
                                                }
                                            </tr>
                                        )
                                    }
                                    {
                                        this.state.values.filter(v=>v!==base).map((v,i) => <tr key={i}>
                                                <td style={{verticalAlign: 'middle'}}>{v.variation}</td>
                                                <td style={{verticalAlign: 'middle'}}>{pageData.assigns[v.variation]}</td>
                                                {
                                                    pageData.experiment.events.map((event,i) => <td key={i}>
                                                            {this.getDiffPercentage(v,event)}
                                                            <br/><span>{v[event.name]}, {this.getSafePercentage(v,event)}</span>
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
                {/*<BarGraph />*/}
                <LineGraph />
            </div>
    }
};