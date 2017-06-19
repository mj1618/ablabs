var Promise = require("bluebird");
var objection = require('objection');
var Model = objection.Model;
var dateFormat = require('dateformat');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: process.env.AB_DB_PASS,
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
    
    $beforeInsert(){
        this.created_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    $beforeUpdate(){
        this.updated_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    // This object defines the relations to other models.
    static get relationMappings() {
        return {
            projects: {
                relation: Model.ManyToManyRelation,
                modelClass: Project,
                join: {
                    from: 'user.email',
                    to: 'project.id',
                    through: {
                        from: 'user_project.email',
                        to: 'user_project.project_id'
                    }
                }
            }
        }
    }
}


class Experiment extends Model {
    static get tableName() { return 'experiment'; }
    $beforeInsert(){
        this.created_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    $beforeUpdate(){
        this.updated_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
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
    $beforeInsert(){
        this.created_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    $beforeUpdate(){
        this.updated_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
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
    $beforeInsert(){
        this.created_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    $beforeUpdate(){
        this.updated_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
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
    $beforeInsert(){
        this.created_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    $beforeUpdate(){
        this.updated_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    static create(projectId, expId, variationId, eventId, uniqueId, amount){
        return Track.query().insert({
            project_id: projectId, 
            experiment_id: expId, 
            variation_id: variationId, 
            event_id: eventId, 
            unique_id: uniqueId, 
            amount
        });
    }
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
    $beforeInsert(){
        this.created_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    $beforeUpdate(){
        this.updated_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    static create(exp, v, uniqueId){
        return Assign.query().insert({unique_id: uniqueId, experiment_id: exp.id, variation_id: v?v.id:null});
    }
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

class UserProject extends Model {
    static get tableName() { return 'user_project'; }
    $beforeInsert(){
        this.created_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    $beforeUpdate(){
        this.updated_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
}
class Project extends Model {
    static get tableName() { return 'project'; }
    $beforeInsert(){
        this.created_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    $beforeUpdate(){
        this.updated_at = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    }
    static create(name, email){
        let project;
        return Project.query().insert({name, token:require('crypto').randomBytes(16).toString('hex')}).then(p=>{
            project = p;
            return p.$relatedQuery('users').relate(email);
        }).then(()=>{
            return project;
        });
    }
    static get relationMappings() {
        return {
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'project.id',
                    to: 'user.email',
                    through: {
                        from: 'user_project.project_id',
                        to: 'user_project.email',
                        extra: ['role']
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
            },
            events: {
                relation: Model.HasManyRelation,
                modelClass: Event,
                join: {
                    from: 'project.id',
                    to: 'event.project_id'
                }
            }
        }
    }
}

const roles = {
    owner: 'owner',
    editor: 'editor',
    viewer: 'viewer'
}

export {
    User,
    Experiment,
    Variation,
    Event,
    Track,
    Project,
    Assign,
    roles,
    UserProject
}
