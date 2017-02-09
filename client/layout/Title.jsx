import React from 'react';
import {State, Actions, Component, Render} from 'jumpsuit';


export default Component({
    render(){
        return <div className="row bg-title">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <h4 className="page-title">{pageData.title}</h4>
            </div>
        </div>;
    }
});