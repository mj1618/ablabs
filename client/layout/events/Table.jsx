import React from 'react';
import CreateEventModal from '../events/CreateModal.jsx';

export default class Table extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            events: pageData.events
        }
    }


    eventCreated(e){
        this.setState({
            events: [e].concat(this.state.events)
        });

        $.toast({
            heading: 'Event created',
            text: '',
            position: 'top-right',
            icon: 'success',
            hideAfter: 2000,
            stack: 6
        });
    }

    eventCreationFailed(){
        $.toast({
            heading: 'Event failed to create',
            text: '',
            position: 'top-right',
            icon: 'warning',
            hideAfter: 2000,
            stack: 6
        });
    }

    render(){
        return <div className="row">
        <div className="col-lg-12">
          <div className="white-box">
            <button type="button" data-toggle="modal" data-target="#createEventModal" className="fcbtn btn btn-primary btn-outline btn-1e waves-effect pull-right">Create Event</button>
            <CreateEventModal success={e=>this.eventCreated(e)} fail={()=>this.eventCreationFailed()} />
            <h3 className="box-title m-b-0">Events </h3>
            <p className="text-muted m-b-20">Click on an event to view and edit</p>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th># Experiments</th>
                    <th># Recorded</th>
                  </tr>
                </thead>
                <tbody>
                    {
                        this.state.events.length===0 && <tr>
                                <td colSpan={4} style={{textAlign:'center'}}>
                                    You have no events
                                </td>
                            </tr>
                    }
                    {
                        this.state.events.map((e,i) => {
                            return <tr key={i}>
                                <td><a href={"/event/"+e.id}>{e.name}</a></td>
                                <td>{e.nExperiments}</td>
                                <td>{e.nTracks}</td>
                            </tr>
                        })
                    }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>;
    }
};
