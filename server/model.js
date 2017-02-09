var Promise = require("bluebird");
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : '127.0.0.1',
        user     : 'root',
        password : 'root',
        database : 'ablabs',
        charset  : 'utf8'
    },
    migrations: {
        tableName: 'migrations'
    },
    seeds: {
      directory: './seeds/'
    }
});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps:true,
  accounts: function(){
    return this.belongsToMany(Account,'user_account')
  }
});

var Experiment = bookshelf.Model.extend({
  tableName: 'experiment',
  hasTimestamps:true,
  variations: function(){
    this.hasMany(Variation)
  },
  events: function(){
    return this.belongsToMany(Event,'experiment_event')
  },
  tracks: function(){
    return this.hasMany(Track).through(Variation)
  }
});

var Variation = bookshelf.Model.extend({
  tableName: 'variation',
  hasTimestamps:true,
  tracks: function(){
   return this.hasMany(Track) 
  }
});

var Event = bookshelf.Model.extend({
  tableName: 'event',
  hasTimestamps:true
});

var Track = bookshelf.Model.extend({
  tableName: 'track',
  hasTimestamps:true
});

var Account = bookshelf.Model.extend({
  tableName: 'account',
  hasTimestamps:true,
  users: function(){
    return this.belongsToMany(User,'user_account') 
  },
  experiments: function(){
    return this.hasMany(Experiment)
  }
});

// User.where('id',1).fetch({withRelated:'accounts'}).then(function(user) {
//   console.log(user.related('accounts').map(acc=>acc.id));
// });

// Experiment.where('id',1).fetch({withRelated:'tracks'}).then(function(e) {
//   console.log(e.related('tracks').map(t=>t.id));
// });

// User.where('id',1).fetch({withRelated:'accounts'}).then(function(user) {
//   new Account().save().tap(acc=>{
//     user.related('accounts').create(user)
//   })
// });

// Account.forge().save().tap(function(acc){
//   Promise.map([User.where('id',1).fetch()], user=>acc.related('users').create(user))
// });

// Account.where('id',1).fetch({withRelated:'experiments'}).then(function(account){
//   console.log(account.related('experiments').map(e=>e.id));
// })

export {
    User,
    Experiment,
    Variation,
    Event,
    Track,
    Account,
    bookshelf
}
