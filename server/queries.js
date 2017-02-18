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
        console.log(project);
    })
)

Promise.all(promises).then(()=>{
    process.exit(0);
})
