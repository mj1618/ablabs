import React from 'react';

export default class Title extends React.Component {
    render(){
        return <div className="row bg-title">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <h4 className="page-title" style={{display:"inline-block"}}>{pageData.title}</h4><small className="m-l-20">{pageData.projectName}</small>
            </div>
        </div>;
    }
};