// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'ablabs',
      user:     'root',
      password: process.env.AB_DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
