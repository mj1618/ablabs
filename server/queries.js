import {Event} from './model';
import Promise from 'bluebird';

let promises = [];

// promises.push(
//     Event.where({project_id:1}).orderBy('id','DESC').fetchAll().then(es=>{
//         es.map(e=>console.log(e.toJSON()));
//     })
// );
// promises.push(
//     Event.where({project_id:1}).orderBy('id','DESC').fetchAll().then(es=>{
//         return Promise.all(es.map( e=>{
//             return Promise.join(
//                 e.related('tracks').count(),
//                 e.related('experiments').count(),
//                 (nTracks,nExperiments)=>{
//                     console.log( {
//                         name: e.get('name'),
//                         nTracks,
//                         nExperiments
//                     });
//                 }
//             );
//         }) )})
// );

promises.push(
    Event.where({id:1}).fetch({withRelated:'experiments'}).then(e=>{
        // console.log(e.experiments());
        return e.experiments().fetch().then(exs=>console.log(exs.length) && exs.map(ex=>console.log(ex.toJSON())))
    })
);


promises.push(
    Event.where({id:2}).fetch({withRelated:'experiments'}).then(e=>{
        // console.log(e.experiments());
        return e.experiments().count().then(c=>console.log(c))
    })
);

Promise.all(promises).then(()=>{
    process.exit(0);
})


// User.where('id',1).fetch({withRelated:'projects'}).then(function(user) {
//   console.log(user.related('projects').map(acc=>acc.id));
// });

// Experiment.where('id',1).fetch({withRelated:'tracks'}).then(function(e) {
//   console.log(e.related('tracks').map(t=>t.id));
// });

// User.where('id',1).fetch({withRelated:'projects'}).then(function(user) {
//   new Project().save().tap(acc=>{
//     user.related('projects').create(user)
//   })
// });

// Project.forge().save().tap(function(acc){
//   Promise.map([User.where('id',1).fetch()], user=>acc.related('users').create(user))
// });

// Project.where('id',1).fetch({withRelated:'experiments'}).then(function(project){
//   console.log(project.related('experiments').map(e=>e.id));
// })

// User.projects().then(projects=>{
//     console.log(JSON.stringify(projects.pop()));
// });
// Project.where({id:10}).fetch().then(p=>console.log(p.get('name')));
// Project.where({id:10}).fetch().then(p=>console.log(p.id));

// Event.where({project_id:1}).fetchAll({withRelated:'tracks',withRelated:'experiments'}).then(es=>{
//     es.map(e=>{
//         console.log(e.related('tracks').count().then(c=>console.log(c)));
//     })
// })