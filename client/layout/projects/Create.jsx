import React from 'react';

export default class Create extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error:''
        };
    }
    submit(e){
        if(this.name.value==''){
            e.preventDefault();
            this.setState({
                error: 'Please enter a project name'
            });
        } else {
            this.setState({
                error: ''
            });
        }
    }

    render(){
        return <div className="row" style={{marginTop:'15vh'}}>
            <div className="col-md-4 col-md-push-4 col-sm-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Create a project </h3>
                    <p className="text-muted m-b-20">Use projects to group your experiments. </p>
                    <form onSubmit={e=>this.submit(e)} className="form-horizontal" method="POST" action="/projects/create">
                        <div className="form-group">
                            <label className="col-md-12">Project Name</label>
                            <div className="col-md-12">
                                <input ref={name=>this.name=name} type="text" name="name" className="form-control" />
                            </div>
                            <span style={{color:"red"}}>{this.state.error}</span>
                        </div>
                        <button onClick={()=>this.submit()} className="btn btn-outline btn-primary fcbtn btn-1e btn-lg btn-block waves-effect">Create</button>
                    </form>
                </div>
            </div>
        </div>;
    }
};