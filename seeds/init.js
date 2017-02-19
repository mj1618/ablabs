function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
      knex('variation').del(),
      knex('experiment').del(),
      knex('user_project').del(),
      knex('user').del(),
      knex('project').del(),
      knex('track').del(),
      knex('event').del(),
      knex('assign').del()
    ])
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('project').insert({id: 1, name: 'VGW'}),
        knex('user').insert({id: 1, first_name: 'Matt', email: 'matthew.stephen.james@gmail.com'}),
        knex('user_project').insert({id: 1, user_id: 1, project_id: 1}),
        knex('experiment').insert({id: 1, name: 'Facebook Redirect', project_id: 1}),
        knex('variation').insert({id: 1, cohort:33, name: 'Standard', experiment_id: 1}),
        knex('variation').insert({id: 2, cohort:33, name: 'Redirect No-Popups', experiment_id: 1}),
        knex('variation').insert({id: 3, cohort:33, name: 'Redirect With-Popups', experiment_id: 1}),
        knex('event').insert({id: 1, name: 'Logged In', project_id: 1}),
        knex('event').insert({id: 2, name: 'Play Game', project_id: 1}),
        knex('experiment_event').insert({id: 1, experiment_id: 1, event_id:1}),
        knex('experiment_event').insert({id: 2, experiment_id: 1, event_id:2})
      ]);
    }).then(()=>{
      let ps = [];
      let users = [];
      for(var i = 0; i<100; i++){
          let user = {unique_id: ''+i, variation_id: getRandomInt(1,4)};
          users.push(user);
          ps.push(knex('assign').insert({unique_id: user.unique_id, variation_id: user.variation_id }));
      }
      for(var i = 0; i<1234; i++){
          let user = users[getRandomInt(0,99)];
          ps.push(knex('track').insert({unique_id: user.unique_id, event_id: getRandomInt(1,3), variation_id: user.variation_id }));
      }

      return Promise.all(ps);
    });
};
