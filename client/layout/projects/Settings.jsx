import React from 'react';
import {TabMenu, TabMenuItem, TabContent, TabPanel} from '../../tabs/index';
import Collaborators from './Collaborators.jsx';

export default class Settings extends React.Component {
    copyToken(){
        this.tokenInput.select();
        document.execCommand('copy');
        $.toast({
            heading: 'Token Copied',
            text: '',
            position: 'top-right',
            icon: 'success',
            hideAfter: 2000,
            stack: 6
        });
    }
    render(){
        return <div className="row">
            <div className="col-lg-8 col-lg-push-2">
                <div className="white-box">
                    <h3 className="box-title m-b-0">{pageData.projectName} Settings</h3>
                    <TabMenu>
                        <TabMenuItem id='integration' name='Integration' icon='zmdi zmdi-layers' first={true} />
                        <TabMenuItem id='collaborators' name='Collaborators' icon='zmdi zmdi-person' />
                    </TabMenu>
                    <TabContent>
                        <TabPanel id='integration' first={true}>
                            <div className="modal-body form-horizontal">
                                <div className="form-group col-md-12">
                                    <label className="control-label">Project API Token</label>
                                    <div className="input-group">
                                        <div className="input-group-btn">
                                            <input readOnly ref={i=>this.tokenInput=i} type="text" value={pageData.token} name="token" className="form-control"/>
                                            <button onClick={()=>this.copyToken()} type="button" className="btn waves-effect waves-light btn-info"><i className="fa fa-copy"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </TabPanel>
                        <TabPanel id='collaborators'>
                            <Collaborators />
                            <div className="clearfix"></div>
                        </TabPanel>
                    </TabContent>
                </div>
            </div>
        </div>;
    }
};