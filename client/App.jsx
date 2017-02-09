import React from 'react';
import {State, Actions, Component, Render} from 'jumpsuit';
import Login from './layout/Login.jsx';
import Experiments from './layout/Experiments.jsx';
import TopBar from './layout/TopBar.jsx';
import Menu from './layout/Menu.jsx';
import Title from './layout/Title.jsx';
const getPage = ()=>{
    switch(pageData.routeId){
        case '404':
            return <div/>;
        case 'login':
            return (<Login/>);
        case 'experiments':
            return <Experiments/>;
        default:
            return <div/>;
    }
};

export default Component({
    render(){
        return <div id="wrapper">
                <TopBar />
                <Menu />
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <Title />
                        { getPage() }
                    </div>
                </div>
            </div>;
        
    }
});