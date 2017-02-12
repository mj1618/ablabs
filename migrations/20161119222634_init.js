
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

      }).createTable('project', function(table) {
        table.bigIncrements('id').primary();
        table.string('name');
        table.timestamps();

      }).createTable('user_project', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('user_id').unsigned().index().references('id').inTable('user').onDelete('CASCADE');
        table.bigInteger('project_id').unsigned().index().references('id').inTable('project').onDelete('CASCADE');
        table.string('role');
        table.timestamps();

      }).createTable('experiment', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('project_id').unsigned().index().references('id').inTable('project').onDelete('CASCADE');
        table.string('name');
        table.boolean('active').defaultTo(true);
        table.string('description',10000);
        table.timestamps();
        table.boolean('deleted').defaultTo(false);

      }).createTable('variation', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('experiment_id').unsigned().index().references('id').inTable('experiment').onDelete('CASCADE');
        table.string('name');
        table.string('description',10000);
        table.integer('cohort');
        table.timestamps();
        table.boolean('deleted').defaultTo(false);

      }).createTable('event', function(table) {
        table.bigIncrements('id').primary();
        table.string('name');
        table.string('description',10000);
        table.bigInteger('project_id').unsigned().index().references('id').inTable('project').onDelete('CASCADE');
        table.timestamps();
        table.boolean('deleted').defaultTo(false);

      }).createTable('experiment_event', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('experiment_id').unsigned().index().references('id').inTable('experiment').onDelete('CASCADE');
        table.bigInteger('event_id').unsigned().index().references('id').inTable('event');
        table.timestamps();

      }).createTable('track', function(table) {
        table.bigIncrements('id').primary();
        table.bigInteger('user_id').unsigned().index().references('id').inTable('user').onDelete('CASCADE');
        table.bigInteger('event_id').unsigned().index().references('id').inTable('event').onDelete('CASCADE');
        table.bigInteger('variation_id').unsigned().index().references('id').inTable('variation').onDelete('CASCADE');
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
        .dropTable('user_project')
        .dropTable('user')
        .dropTable('project')
        ;
};
