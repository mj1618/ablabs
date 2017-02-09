
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user', function(table) {
        table.bigIncrements('id').primary();
        table.string('email');
        table.unique('email');
        table.string('first_name');
        table.string('last_name');
        table.string('google_link');
        table.string('picture');
        table.boolean('verified_email');
        table.timestamps();

      }).createTable('account', function(table) {
        table.bigIncrements('id').primary();
        table.timestamps();

      }).createTable('user_account', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('user_id').unsigned().index().references('id').inTable('user');
        table.bigInteger('account_id').unsigned().index().references('id').inTable('account');
        table.string('role');
        table.timestamps();

      }).createTable('experiment', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('account_id').unsigned().index().references('id').inTable('account');
        table.string('name');
        table.boolean('active').defaultTo(true);
        table.string('description',10000);
        table.timestamps();
        table.boolean('deleted').defaultTo(false);

      }).createTable('variation', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('experiment_id').unsigned().index().references('id').inTable('experiment');
        table.string('name');
        table.string('description',10000);
        table.integer('cohort');
        table.timestamps();
        table.boolean('deleted').defaultTo(false);

      }).createTable('event', function(table) {
        table.bigIncrements('id').primary();
        table.string('name');
        table.string('description',10000);
        table.timestamps();
        table.boolean('deleted').defaultTo(false);

      }).createTable('experiment_event', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('experiment_id').unsigned().index().references('id').inTable('experiment');
        table.bigInteger('event_id').unsigned().index().references('id').inTable('event');
        table.timestamps();

      }).createTable('track', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('user_id').unsigned().index().references('id').inTable('user');
        table.bigInteger('event_id').unsigned().index().references('id').inTable('event');
        table.bigInteger('variation_id').unsigned().index().references('id').inTable('variation');
        table.integer('amount');
        table.timestamps();
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('track')
        .dropTable('experiment_event')
        .dropTable('event')
        .dropTable('variation')
        .dropTable('experiment')
        .dropTable('user_account')
        .dropTable('user')
        .dropTable('account')
        ;
};
