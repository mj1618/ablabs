import React from 'react';
import Login from './layout/auth/Login.jsx';
import LoginEmail from './layout/auth/LoginEmail.jsx';
import ExperimentsTable from './layout/experiments/Table.jsx';
import EventsTable from './layout/events/Table.jsx';
import ProjectsCreate from './layout/projects/Create.jsx';
import ExperimentsCreate from './layout/experiments/Create.jsx';
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
            return <ExperimentsTable/>;
        case 'events':
            return <EventsTable/>;
        case 'create-experiment':
            return <ExperimentsCreate/>;
        case 'create-project':
            return <ProjectsCreate/>;
        case 'login-email':
            return <LoginEmail/>;
        default:
            return <div/>;
    }
};

export default class Dashboard extends React.Component {
    render(){
        const styles = {};
        if(pageData.showMenu===false){
            styles.margin = '0';
        }
        return <div id="wrapper">
                <TopBar />
                { pageData.showMenu && <Menu /> }
                <div id="page-wrapper" style={styles}>
                    <div className="container-fluid">
                        { pageData.showTitle && <Title /> }
                        { getPage() }
                    </div>
                </div>
            </div>;
        
    }
};