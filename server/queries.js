import {
    User,
    Experiment,
    Variation,
    Event,
    Track,
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
        console.log(exps.map((exp)=>{
            return exp.variations.reduce((t, e)=>t+e.tracks.length,0)
        }));
    })
)

Promise.all(promises).then(()=>{
    process.exit(0);
})
