import React from 'react';

export default class Create extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            description: "",
            cohort: 90,
            variations: [
                {
                    name: "Variation 1",
                    description: "",
                    percent: 50
                },
                {
                    name: "Variation 2",
                    description: "",
                    percent: 50
                }
            ]
        };
    }

    addVariation(){
        this.setState({
            variations: this.state.variations.concat({
                name: "Variation "+(this.state.variations.length+1),
                description: "",
                percent: 0
            })
        });
        return false;
    }

    removeVariation(i){
        if(this.state.variations.length>1){
            this.setState({
                variations: this.state.variations.filter((v,j)=>j!==i)
            });
        }
        return false;
    }

    render() {
        return <div className="row">
            <div className="col-lg-8 col-lg-push-2">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Create a New Experiment </h3>
                    <p className="text-muted m-b-30 font-13">An experiment is the basis for an AB test. You define what your variations are and what percentage of users to target.</p>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="col-md-12">Experiment Name</label>
                            <div className="col-md-12">
                                <input type="text" name="name" className="form-control" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-12">Description</label>
                            <div className="col-md-12">
                                <textarea className="form-control" rows="5"></textarea>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-12">Cohort</label>
                            <div className="col-md-3">
                                <input type="number" name="cohort" defaultValue={90} className="form-control" style={{maxWidth:'80px', textAlign:'right', display:'inline'}} /><span> %</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-12">Variations</label>
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Key</th>
                                                <th style={{width:'80px'}}>Cohort %</th>
                                                <th style={{width:'40px'}}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.variations.map((v,i)=>{
                                                    return <tr key={i}>
                                                        <td>
                                                            <input type="text" value={v.name} className="form-control"/>
                                                        </td>
                                                        <td>
                                                            <input type="text" value={v.description} className="form-control"/>
                                                        </td>
                                                        <td>
                                                            <input type="number" value={v.percent} className="form-control"/>
                                                        </td>
                                                        <td>
                                                            <button type="button" onClick={()=>this.removeVariation(i)} className="btn btn-danger btn-circle waves-effect"><i className="fa fa-minus"></i> </button>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <button type="button" className="btn btn-info waves-effect pull-right" onClick={()=>this.addVariation()}>Add Variation</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-12">Events</label>
                            
                        </div>

                    </form>
                </div>
            </div>
        </div>;
    }
};