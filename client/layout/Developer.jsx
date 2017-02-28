import React from 'react';

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
                        <p className="text-muted m-b-20"></p>
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
                        <h3 className="box-title m-b-0">Assign API</h3>
                        The Assign API is used to randomly assign a user to a variation based on the 'cohort %' weightings.
                        The experiment must be in 'slug' form, i.e. all lower case and spaces replaced with dashes.
                        <br/>
                        <strong>Example Request</strong>
                        <pre><code className="language-markup">{`curl -X POST /api/assign?experiment=${experiment}&user=${user}&token=${token}`}</code></pre>
                        <strong>Example Response</strong>
                        <pre><code className="language-json">{`{
	"result": "success",
	"experiment": "${experiment}",
	"variation": "${variation}"
}`}</code></pre>
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
                        <strong>Example Request</strong>
                        <pre><code className="language-markup">{`curl -X POST /api/track?event=${event}&user=${user}&experiments=${experiments}&token=${token}`}</code></pre>
                        <strong>Example Response</strong>
                        <pre><code className="language-json">{`{
	"result": "success"
}`}</code></pre>
                    </div>
                </div>
            </div>
        </div>;
    }
};