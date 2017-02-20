import React from 'react';

export default class TabMenu extends React.Component {
    render(){
        return <div className="tab-content">
                {this.props.children}
            </div>;
    }
}