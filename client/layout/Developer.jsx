import React from 'react';

export default class Developer extends React.Component {

    componentDidMount(){
        $(document).ready(function() {
            hljs.initHighlightingOnLoad();
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        });
    }

    render(){
        return <div className="row">
            <div className="col-md-12">
                <div className="white-box">
                    <h3 className="box-title m-b-0">Developer Guide </h3>
                    <p className="text-muted m-b-20"></p>
                    
                    <pre><code className="hljs">{`curl -X "https://ablabs.io/api/expeirments?token=${pageData.token}"`}</code></pre>
                </div>
            </div>
        </div>;
    }
};