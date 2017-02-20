import React from 'react';

export default class TabMenu extends React.Component {
    render(){
        return <li role="presentation" className={this.props.first===true?'active':''}>
                    <a href={"#"+this.props.id} aria-controls={this.props.id} role="tab" data-toggle="tab" aria-expanded="true">
                        <span className="visible-xs">
                            <i className="zmdi zmdi-layers"></i>
                        </span>
                        <span className="hidden-xs">{this.props.name}</span>
                    </a>
                </li>;
    }
}