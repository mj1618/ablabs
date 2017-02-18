import React from 'react';

export default class Create extends React.Component {
    render(){
        return <div className="row" style={{marginTop:'15vh'}}>
            <div className="col-md-4 col-md-push-4 col-sm-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Create your project </h3>
                    <p className="text-muted m-b-20">Use projects to group your experiments. </p>
                    <form className="form-horizontal" method="POST" action="/projects/create">
                        <div className="form-group">
                            <label className="col-md-12">Project Name</label>
                            <div className="col-md-12">
                                <input type="text" name="name" className="form-control" />
                            </div>
                        </div>
                        <button className="btn btn-outline btn-primary fcbtn btn-1e btn-lg btn-block waves-effect">Create</button>
                    </form>
                </div>
            </div>
        </div>;
    }
};