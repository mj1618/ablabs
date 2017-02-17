var Promise = require("bluebird");
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'ablabs',
        charset: 'utf8'
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
    hasTimestamps: true,
    projects: function () {
        return this.belongsToMany(Project, 'user_project')
    }
}, {
    projects: function(){
        return User.where('id',1).fetch({withRelated:'projects'}).then(function(user) {
            return user.related('projects').fetch();
        });
    }
});

var Experiment = bookshelf.Model.extend({
    tableName: 'experiment',
    hasTimestamps: true,
    variations: function () {
        this.hasMany(Variation)
    },
    events: function () {
        return this.belongsToMany(Event, 'experiment_event')
    },
    tracks: function () {
        return this.hasMany(Track).through(Variation)
    }
});

var Variation = bookshelf.Model.extend({
    tableName: 'variation',
    hasTimestamps: true,
    tracks: function () {
        return this.hasMany(Track)
    }
});

var Event = bookshelf.Model.extend({
    tableName: 'event',
    hasTimestamps: true,
    experiments: function () {
        return this.belongsToMany(Experiment, 'experiment_event','event_id','experiment_id')
    },
    tracks: function () {
        return this.hasMany(Track)
    }
},{
    create: function(name, projectId){
        return new Event({name,project_id:projectId}).save();
    },
    findByProject: function(project){
        return Event.where({project_id: project}).fetchAll()
    }
});

var Track = bookshelf.Model.extend({
    tableName: 'track',
    hasTimestamps: true
});

var Project = bookshelf.Model.extend({
    tableName: 'project',
    hasTimestamps: true,
    users: function () {
        return this.belongsToMany(User, 'user_project')
    },
    experiments: function () {
        return this.hasMany(Experiment)
    }
},{
    create: function(name, userId){
        return new Project({name}).save().tap(project=>{
            return User.where('id',userId).fetch().then(user=>{
                return project.related('users').create(user);
            });
        });
    }
});


export {
    User,
    Experiment,
    Variation,
    Event,
    Track,
    Project,
    bookshelf
}
