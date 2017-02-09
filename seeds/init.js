
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
      knex('variation').del(),
      knex('experiment').del(),
      knex('user_account').del(),
      knex('user').del(),
      knex('account').del(),
      knex('track').del(),
      knex('event').del()
    ])
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('account').insert({id: 1}),
        knex('user').insert({id: 1, first_name: 'Matt'}),
        knex('user_account').insert({id: 1, user_id: 1, account_id: 1}),
        knex('experiment').insert({id: 1, name: 'Facebook Redirect', account_id: 1}),
        knex('experiment').insert({id: 2, name: 'Test Exp', account_id: 1}),
        knex('variation').insert({id: 1, name: 'Var1', experiment_id: 1}),
        knex('variation').insert({id: 2, name: 'Var2', experiment_id: 2}),
        knex('event').insert({id: 1, name: 'E1'}),
        knex('track').insert({id: 1, variation_id: 1, event_id:1}),
        knex('track').insert({id: 2, variation_id: 1, event_id:1}),
        knex('track').insert({id: 3, variation_id: 2, event_id:1}),
      ]);
    });
};
