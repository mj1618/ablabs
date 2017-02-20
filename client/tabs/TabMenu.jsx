import React from 'react';

export default class TabMenu extends React.Component {
    render(){
        return <ul className="nav customtab nav-tabs" role="tablist">
                    {this.props.children}
                </ul>
    }
}


                    {/*<TabMenu>
                        <TabMenuItem id='integration' name='Integration' icon='zmdi zmdi-layers' first={true} />
                        <TabMenuItem id='collaborators' name='Collaborators' icon='zmdi zmdi-person' />
                    </TabMenu>
                    <TabContent>
                        <TabPanel id='integration' first={true}>
                        </TabPanel>
                        <TabPanel id='collaborators'>
                        </TabPanel>
                    </TabContent>*/}