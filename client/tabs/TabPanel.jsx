import React from 'react';

export default class TabMenu extends React.Component {
    render(){
        return <div role="tabpanel" className={"tab-pane fade "+(this.props.first===true?' active in':'')} id={this.props.id}>
                {this.props.children}
            </div>;
    }
}