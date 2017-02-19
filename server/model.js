var Promise = require("bluebird");
var objection = require('objection');
var Model = objection.Model;
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
Model.knex(knex);

class User extends Model {
    static get tableName() { return 'user'; }
    // This object defines the relations to other models.
    static get relationMappings() {
        return {
            projects: {
                relation: Model.ManyToManyRelation,
                modelClass: Project,
                join: {
                    from: 'user.id',
                    to: 'project.id',
                    through: {
                        from: 'user_project.user_id',
                        to: 'user_project.project_id'
                    }
                }
            }
        }
    }
}


class Experiment extends Model {
    static get tableName() { return 'experiment'; }
    // This object defines the relations to other models.
    static get relationMappings() {
        return {
            events: {
                relation: Model.ManyToManyRelation,
                modelClass: Event,
                join: {
                    from: 'experiment.id',
                    to: 'event.id',
                    through: {
                        from: 'experiment_event.experiment_id',
                        to: 'experiment_event.event_id'
                    }
                }
            },
            variations: {
                relation: Model.HasManyRelation,
                modelClass: Variation,
                join: {
                    from: 'experiment.id',
                    to: 'variation.experiment_id'
                }
            }
        }
    }
}


class Variation extends Model {
    static get tableName() { return 'variation'; }
    // This object defines the relations to other models.
    static get relationMappings() {
        return {
            tracks: {
                relation: Model.HasManyRelation,
                modelClass: Track,
                join: {
                    from: 'variation.id',
                    to: 'track.variation_id'
                }
            },
            tracks: {
                relation: Model.HasManyRelation,
                modelClass: Track,
                join: {
                    from: 'variation.id',
                    to: 'track.variation_id'
                }
            },
            assigns: {
                relation: Model.HasManyRelation,
                modelClass: Assign,
                join: {
                    from: 'variation.id',
                    to: 'assign.variation_id'
                }
            }
        }
    }
}


class Event extends Model {
    static get tableName() { return 'event'; }
    // This object defines the relations to other models.
    static get relationMappings() {
        return {
            experiments: {
                relation: Model.ManyToManyRelation,
                modelClass: Experiment,
                join: {
                    from: 'event.id',
                    to: 'experiment.id',
                    through: {
                        from: 'experiment_event.event_id',
                        to: 'experiment_event.experiment_id'
                    }
                }
            },
            tracks: {
                relation: Model.HasManyRelation,
                modelClass: Track,
                join: {
                    from: 'event.id',
                    to: 'track.event_id'
                }
            }
        }
    }
}


class Track extends Model {
    static get tableName() { return 'track'; }
    static get relationMappings() {
        return {
            variation: {
                relation: Model.BelongsToOneRelation,
                modelClass: Variation,
                join: {
                    from: 'track.variation_id',
                    to: 'variation.id'
                }
            },
            event: {
                relation: Model.BelongsToOneRelation,
                modelClass: Event,
                join: {
                    from: 'track.event_id',
                    to: 'event.id'
                }
            }
        }
    }
}

class Assign extends Model {
    static get tableName() { return 'assign'; }
    static get relationMappings() {
        return {
            variation: {
                relation: Model.BelongsToOneRelation,
                modelClass: Variation,
                join: {
                    from: 'assign.variation_id',
                    to: 'variation.id'
                }
            }
        }
    }
}


class Project extends Model {
    static get tableName() { return 'project'; }
    static create(name, userId){
        return Project.query().insert({name}).then(project=>{
            return project.$relatedQuery('users').relate(userId);
        });
    }
    static get relationMappings() {
        return {
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'project.id',
                    to: 'user.id',
                    through: {
                        from: 'user_project.project_id',
                        to: 'user_project.user_id'
                    }
                }
            },
            experiments: {
                relation: Model.HasManyRelation,
                modelClass: Experiment,
                join: {
                    from: 'project.id',
                    to: 'experiment.project_id'
                }
            }
        }
    }
}


export {
    User,
    Experiment,
    Variation,
    Event,
    Track,
    Project,
    Assign
}
