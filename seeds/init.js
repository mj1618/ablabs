
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('variation').del()
    .then(()=>{
      return knex('experiment').del()
    })
    .then(()=>{
      return knex('user').del()
    })
    .then(()=>{
      return knex('account').del()
    })
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
      ]);
    });
};
