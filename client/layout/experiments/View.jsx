import React from 'react';
import {focusInCurrentTarget} from '../../util/helpers';
import Promise from 'bluebird';
import 'whatwg-fetch';

export default class View extends React.Component {

    render() {
        return <div className="row">
            <div className="col-lg-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Experiment Report</h3>
                    <p className="text-muted m-b-30 font-13"></p>
                </div>
            </div>
        </div>;
    }
};