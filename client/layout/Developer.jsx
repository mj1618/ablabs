import React from 'react';
import {TabMenu, TabMenuItem, TabContent, TabPanel} from '../tabs/index';

export default class Developer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: '1234',
            experiment: pageData.experiments[0] ? slugify(pageData.experiments[0].name) : 'popup-tutorial',
            experiments: [pageData.experiments[0] ? slugify(pageData.experiments[0].name) : 'popup-tutorial'],
            event: pageData.events[0] ? slugify(pageData.events[0].name) : 'registered',
            variation: pageData.experiments[0] ? pageData.experiments[0].variations[0].name : 'show-tutorial',
        };
    }

    // componentDidMount(){
    //     $(document).ready(function() {
    //         hljs.initHighlightingOnLoad();
    //         $('pre code').each(function(i, block) {
    //             hljs.highlightBlock(block);
    //         });
    //     });
    // }

    render(){
        const experiment = this.state.experiment;
        const token = pageData.token;
        const user = this.state.user;
        const event = this.state.event;
        const experiments= this.state.experiments.join(',');
        const variation = this.state.variation;

        return <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="white-box">
                        <h3 className="box-title m-b-0">Developer Guide </h3>

                        <p className="text-muted m-b-20">
                            This guide will step you through an end-to-end experiment. 
                            <br/>
                            To try a live demo, check out the <a target="_blank" href="https://ablabs.io/demo-browser.html">Browser Demo</a> and <a target="_blank" href="https://ablabs.io/demo-node.html">Node Demo</a>
                        </p>
                        Let's say you have written a tutorial popup on your website that explains to users how the site works.
                        You aren't sure if this tutorial will be too annoying and hinder your sites performance, or if people will appreciate the explanation and use the site better.
                        So you decided to create the <mark>Popup Tutorial</mark> experiment.
                        
                        The experiment has 2 variations that users are randomly grouped into:
                        <ul>
                            <li>No Tutorial - 50%</li>
                            <li>Show Tutorial - 50%</li>
                        </ul>
                        And 2 Events that you track for the user:
                        <ul>
                            <li>Registered</li>
                            <li>Purchased</li>
                        </ul>

                        A typical user flow using this experiment would work as follows:
                        <ol>
                            <li>User accesses the home page of your website</li>
                            <li>The 'Assign API' is used to assign the user to a variation</li>
                            <li>If the user is in the 'No Tutorial' variation your code will not show the tutorial. Conversley if they are in the 'Show Tutorial' variation you will run your code that shows the tutorial</li>
                            <li>If the user registers, you track the user against the 'Registered' event</li>
                            <li>If the user makes a purchase, you track the user against the 'Purchase' event with the amount of the purchase</li>
                        </ol>

                        Simple! You now have your first experiment. 
                        Once you have had enough users enter the experiment you will be able to see the results by viewing the Experiment Report.
                        It will be able to tell if the Tutorial Popup helped improve registrations and purchases on your site, and thereby determine if you should go live with the experiment.
                        {/*<pre><code className="hljs">{`curl -X POST /api/experiment/${experiment}/assign?token=${token}&user=${user}
    curl -X POST /api/event/${event}/track?token=${token}&user=${user}&experiments=${experiments}`}</code></pre>*/}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="white-box">
                        <h3 className="box-title m-b-0">Install</h3>
                        
                        <br/>
                        
                        <TabMenu>
                            <TabMenuItem id='install-browser-js' name='Browser JS' icon='zmdi zmdi-code' first={true} />
                            <TabMenuItem id='install-node-js' name='Node JS' icon='zmdi zmdi-code' />
                            <TabMenuItem id='install-jquery' name='JQuery' icon='zmdi zmdi-code' />
                            <TabMenuItem id='install-curl' name='cURL' icon='zmdi zmdi-code' />
                        </TabMenu>
                        <TabContent>
                            <TabPanel id='install-browser-js' first={true}>
                                <strong>Install with CDN</strong>
                                <p>This is to use the <a target="_blank" href="https://github.com/mj1618/ablabs-js">ablabs-js</a> package in your browser</p>
                                <pre><code className="language-html">{`<script src="https://cdn.rawgit.com/mj1618/ablabs-js/v1.0.7/build/ablabs.min.js"></script>`}</code></pre>
                                <pre><code className="language-js">{`var ab = new ABLabs.default('${token}', '1234') // assuming user ID is 1234, optionally leave blank`}</code></pre>
                            </TabPanel>
                            <TabPanel id='install-node-js'>
                                <strong>Install with NPM</strong>
                                <p>This is to use the <a target="_blank" href="https://github.com/mj1618/ablabs-js">ablabs-js</a> package on a Node server</p>
                                <pre><code className="language-javascript">{`npm install --save ablabs-js`}</code></pre>
                                <pre><code className="language-javascript">{`import ABLabs from 'ablabs-js'
const ab = new ABLabs('${token}', '1234') // assuming user ID is 1234, optionally leave blank`}</code></pre>
                            </TabPanel>
                            <TabPanel id='install-jquery'>
                                <strong>Install JQuery</strong>
                                <pre><code className="language-html">{`<script
  src="https://code.jquery.com/jquery-3.2.1.min.js"
  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
  crossorigin="anonymous"></script>`}</code></pre>
                            </TabPanel>

                            <TabPanel id='install-curl'>
                                <strong>Install cURL</strong>
                                <p>See <a target="_blank" href="https://curl.haxx.se/download.html">https://curl.haxx.se/download.html</a> for details.</p>
                            </TabPanel>
                        </TabContent>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="white-box">
                        <h3 className="box-title m-b-0">Assign API</h3>
                        The Assign API is used to randomly assign a user to a variation based on the 'cohort %' weightings.
                        The experiment must be in 'slug' form, i.e. all lower case and spaces replaced with dashes.
                        <br/>
                        
                        <TabMenu>
                            <TabMenuItem id='assign-js' name='ablabs-js' icon='zmdi zmdi-code' first={true}  />
                            <TabMenuItem id='assign-jquery' name='JQuery' icon='zmdi zmdi-code' />
                            <TabMenuItem id='assign-curl' name='cURL' icon='zmdi zmdi-code' />
                            
                        </TabMenu>
                        <TabContent>
                            <TabPanel id='assign-curl'>
                                <strong>Example Request</strong>
                                <pre><code className="language-json">{`curl -X "POST" \\
     -H "Content-Type: application/json" \\
     -d '{ 
           "experiment": "${experiment}", 
           "user": "${user}", 
           "token": "${token}" 
         }' \\
     "https://ablabs.io/api/v1/assign"`}</code></pre>

                        <strong>Example Response</strong>
                        <pre><code className="language-json">{`{
	"result": "success",
	"experiment": "${experiment}",
	"variation": "${variation}"
}`}</code></pre>
                            </TabPanel>
                            <TabPanel id='assign-js' first={true}>
                                <strong>Example Request</strong>
                                <pre><code className="language-javascript">{`ab.assign('${experiment}').then(response=>{
    console.log('Successfully assigned user in ${experiment} experiment');
    console.log('User "'+ab.user+'" is in variation: '+response.variation)
})`}</code></pre>

                        <strong>Example Output</strong>
                        <pre><code className="language-markup">{`Successfully assigned user in ${experiment} experiment
User "${user}" is in variation: ${variation}`}</code></pre>
                            </TabPanel>
                            <TabPanel id='assign-jquery'>
                                <strong>Example Request</strong>
                                <pre><code className="language-javascript">{`var experiments=[];
$.ajax({
    type:'POST',
    url: 'https://ablabs.io/api/v1/assign',
    data: JSON.stringify({ 
        experiment: '${experiment}', 
        user: '${user}', 
        token: '${token}'
    }),
    dataType: 'json',
    contentType: 'application/json',
    success: function(response){
        if(response.result==='success'){
            experiments.push('${experiment}');
            console.log('Successfully assigned user in ${experiment} experiment');
            console.log('User "${user}" is in variation: '+response.variation);
            // here you can change your application behaviour based on the users Variation
        }
    }
});`}</code></pre>
                                <strong>Example Output</strong>
                                <pre><code className="language-markup">{`Successfully assigned user in ${experiment} experiment
User "${user}" is in variation: ${variation}`}</code></pre>

                            </TabPanel>
                        </TabContent>



                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="white-box">
                        <h3 className="box-title m-b-0">Track API</h3>
                        The track API is used to track events against experiments. 
                        Note that the experiments must be comma separated if you are tracking more than one.
                        The events and experiments must also be in 'slug' form, i.e. all lower case and spaces replaced with dashes.
                        <br/>
                        
                        <TabMenu>
                            <TabMenuItem id='track-js' name='ablabs-js' icon='zmdi zmdi-code' first={true} />
                            <TabMenuItem id='track-jquery' name='JQuery' icon='zmdi zmdi-code' />
                            <TabMenuItem id='track-curl' name='cURL' icon='zmdi zmdi-code' />
                            
                        </TabMenu>
                        <TabContent>
                            <TabPanel id='track-curl'>
                                <strong>Example Request</strong>
                                <pre><code className="language-json">{`curl -X "POST" \\
     -H "Content-Type: application/json" \\
     -d '{
           "event": "${event}",
           "user": "${user}",
           "experiments": [${JSON.stringify(experiments)}],
           "token": "${token}"
         }' \\
     "https://ablabs.io/api/v1/track"`}</code></pre>

                        <strong>Example Response</strong>
                        <pre><code className="language-json">{`{
	"result": "success"
}`}</code></pre>
                            </TabPanel>
                            <TabPanel id='track-js' first={true}>
                                <strong>Example Request</strong>
                                <pre><code className="language-javascript">{`ab.track('${event}').then(res=>{
    if(res.result==='success')
        console.log('Successfully tracked ${event} event for user '+ab.user);
})`}</code></pre>
<strong>Example Output</strong>
                        <pre><code className="language-markup">{`Successfully tracked ${event} event for user ${user}`}</code></pre>
                            </TabPanel>
                            <TabPanel id='track-jquery'>
                                <strong>Example Request</strong>
                                <pre><code className="language-javascript">{`$.ajax({
    type:'POST',
    url: 'https://ablabs.io/api/v1/track',
    data: JSON.stringify({ 
        event: '${event}', 
        user: '${user}', 
        experiments: experiments, //experiments === [${JSON.stringify(experiments)}] from assign api call
        token: '${token}'
    }),
    dataType: 'json',
    contentType: 'application/json',
    success: function(response){
        if(response.result==='success'){
            console.log('Successfully tracked ${event} event for user ${user}');
        }
    }
});`}</code></pre>
                        <strong>Example Output</strong>
                        <pre><code className="language-markup">{`Successfully tracked ${event} event for user ${user}`}</code></pre>

                            </TabPanel>
                        </TabContent>


                    </div>
                </div>
            </div>
        </div>;
    }
};