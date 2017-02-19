import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';
import Promise from 'bluebird';
import 'whatwg-fetch';

export default class View extends React.Component {
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