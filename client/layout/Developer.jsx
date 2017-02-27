import React from 'react';

export default class Developer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: '1234',
            experiment: pageData.experiments[0] ? slugify(pageData.experiments[0].name) : 'your-experiment',
            experiments: [pageData.experiments[0] ? slugify(pageData.experiments[0].name) : 'your-experiment'],
            event: pageData.events[0] ? slugify(pageData.events[0].name) : 'your-experiment'
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

        return <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="white-box">
                        <h3 className="box-title m-b-0">Developer Guide </h3>
                        <p className="text-muted m-b-20"></p>
                        {/*<pre><code className="hljs">{`curl -X POST /api/experiment/${experiment}/assign?token=${token}&user=${user}
    curl -X POST /api/event/${event}/track?token=${token}&user=${user}&experiments=${experiments}`}</code></pre>*/}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="white-box">
                        <h3 className="box-title m-b-0">Assign API</h3>
                        <pre><code className="language-markup">{`curl -X POST /api/assign?experiment=${experiment}&user=${user}&token=${token}`}</code></pre>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="white-box">
                        <h3 className="box-title m-b-0">Track API</h3>
                        <pre><code className="language-markup">{`curl -X POST /api/track?event=${event}&user=${user}&experiments=${experiments}&token=${token}`}</code></pre>
                    </div>
                </div>
            </div>
        </div>;
    }
};