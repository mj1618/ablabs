import React from 'react';

export default class Table extends React.Component {
    render(){
        return <div className="row">
        <div className="col-lg-12">
          <div className="white-box">
            <a href="/experiments/create" className="fcbtn btn btn-primary btn-outline btn-1e waves-effect pull-right">Create Experiment</a>
            <h3 className="box-title m-b-0">Experiments </h3>
            <p className="text-muted m-b-20">Click on an experiment to view and edit</p>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Experiment</th>
                    <th>Cohort %</th>
                    <th>Unique Users</th>
                    <th>Events</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                    {
                        pageData.experiments.length===0 && <tr>
                                <td colSpan={5} style={{textAlign:'center'}}>
                                    You have no experiments
                                </td>
                            </tr>
                    }
                    {
                        pageData.experiments.map((exp,i) => {
                            return <tr key={i}>
                                <td><a href={"/experiments/"+exp.id}>{exp.name}</a></td>
                                <td>{exp.cohortPercent}</td>
                                <td>{exp.nUsers}</td>
                                <td>{exp.nEvents}</td>
                                { exp.active===true && <td><div className="label label-table label-success">Active</div></td> }
                                { exp.active!==true && <td><div className="label label-table label-warning">Paused</div></td> }
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
