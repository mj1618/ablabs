import React from 'react';
import {render} from 'react-dom';
import Dashboard from './Dashboard.jsx';

global.slugify = (n) => {
    return n.toLowerCase()
        .replace(/[^a-z0-9-]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

global.compareSlug = (n1,n2) => {
    console.log(slugify(n1) +' '+ slugify(n2));
    return slugify(n1) == slugify(n2);
};

render(<Dashboard />, document.querySelector('#app'));
