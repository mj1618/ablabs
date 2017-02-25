import {
    User,
    Experiment,
    Variation,
    Event,
    Track,
    Assign,
    Project } from './model';
import Promise from 'bluebird';

let promises = [];


promises.push(
    Project.query().findById(1).eager('experiments').then(project=>{
        // console.log(project);
    })
)


promises.push(
    Experiment.query().where('project_id',8).then(exps=>{
        let experiments = exps;
        return Promise.map(experiments, experiment => {
            return experiment.$relatedQuery('variations');
        });
    }).then(vvs=>{
        return vvs.map(vs=>{
            return vs.reduce((t,v) => t+v.cohort, 0);
        })
    }).then(sums=>{
        console.log(sums);
    })
)

let users = {};
promises.push(
    Experiment.query().where('project_id',8).eager('variations.tracks').then(exps=>{
        // console.log(exps.map((exp)=>{
        //     return exp.variations.reduce((t, e)=>t+e.tracks.length,0)
        // }));
    })
)

const slugify = (n) => {
    return n.toLowerCase()
        .replace(/[^a-z0-9-]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

const compareSlug = (n1,n2) => {
    return slugify(n1) == slugify(n2);
};

console.log(slugify('Facebook Redirect'));


const chooseVariation = (variations) => {
    let rand = Math.random();
    return variations.find(v=>{
        let x = v.cohort / 100.0;
        if(rand < x){
            return true;
        } else {
            rand -= x;
            return false;
        }
    });
}

let res = [0,0,0,0];
for(var i = 0; i < 10000; i++){
    let v = chooseVariation([
        {
            cohort: 33,
            id: 0
        },
        {
            cohort: 33,
            id: 1
        },
        {
            cohort: 33,
            id: 2
        }
    ]);
    if(!v){
        res[res.length-1] += 1;
    } else {
        res[v.id] += 1;
    }
    
}

console.log(res.map(r=>100.0 * r / 10000));


promises.push(
    Assign.query().findById(1).eager('variation').then(assign=>{
        console.log(assign);
    })
)


promises.push(
    Assign.query().whereIn('variation_id',[1,2,3]).count().then(c=>{
        console.log(c[0]['count(*)']);
    })
)

promises.push(
    Experiment.query().findById(1).eager('[variations,events]').then(exp=>{
        return Track.query()
            .select('event_id','variation_id')
            .whereIn('event_id',exp.events.map(e=>e.id))
            .whereIn('variation_id',exp.variations.map(v=>v.id))
            .groupBy('event_id')
            .groupBy('variation_id')
            .count()
    }).then(ns=>{
        console.log(ns);
    })
);

Promise.all(promises).then(()=>{
    process.exit(0);
})
