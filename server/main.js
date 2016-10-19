import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

if(Meteor.isServer) {
    // When Meteor starts, create new collection in Mongo if not exists.
    Meteor.startup(function () {
        // Define the schema
        schemaValidation = !true;
        User = new Meteor.Collection('user');
        BookSchema = new SimpleSchema({
            name: {
                type: String,
                max: 200
            },
            email: {
                type: String,
            },
            course: {
                type: String,
            },
            gender: {
                type: String,
            },
            subjects: {
                type: Array
            },
            "subjects.$": {
                type: String
            }
        });
        schemaValidation && User.attachSchema(BookSchema);
    });

// GET /user - returns every message from MongoDB collection.

    Router.route('/users',{where: 'server'})
        .get(function(){
            var response = User.find().fetch();
            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        })

        // POST /message - {message as post data}
        // Add new message in MongoDB collection.

        .post(function(){
            var response;
            var obj = {
                name : this.request.body.name,
                email : this.request.body.email,
                gender : this.request.body.gender,
                course : this.request.body.course,
                subjects : this.request.body.subjects,
            }
            schemaValidation && BookSchema.validate(obj);
                obj._id = User.insert(obj);
                response = {
                    "error" : false,
                    "message" : "user added",
                    "data" : obj,
                }

            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        });

    Router.route('/users/:id',{where: 'server'})

        // GET /message/:id - returns specific records

        .get(function(){
            var response;
            if(this.params.id !== undefined) {
                var data = User.find({_id : this.params.id}).fetch();
                if(data.length > 0) {
                    response = data
                } else {
                    response = {
                        "error" : true,
                        "message" : "User not found."
                    }
                }
            }
            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        })

        // PUT /message/:id {message as put data}- update specific records.

        .put(function(){
            var response;
            if(this.params.id !== undefined) {
                var data = User.find({_id : this.params.id}).fetch();
                if(data.length > 0) {
                    var obj = {
                        name : this.request.body.name,
                        email : this.request.body.email,
                        course : this.request.body.course,
                        gender : this.request.body.gender,
                        subjects : this.request.body.subjects
                    };
                    schemaValidation && BookSchema.validate(obj);
                    if(User.update({_id : data[0]._id},{$set : obj}) === 1) {
                        response = {
                            "error" : false,
                            "message" : "User information updated.",
                        }
                    } else {
                        response = {
                            "error" : true,
                            "message" : "User information not updated."
                        }
                    }
                } else {
                    response = {
                        "error" : true,
                        "message" : "User not found."
                    }
                }
            }
            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        })

        // DELETE /message/:id delete specific record.

        .delete(function(){
            var response;
            if(this.params.id !== undefined) {
                var data = User.find({_id : this.params.id}).fetch();
                if(data.length >  0) {
                    if(User.remove(data[0]._id) === 1) {
                        response = {
                            "error" : false,
                            "message" : "User deleted."
                        }
                    } else {
                        response = {
                            "error" : true,
                            "message" : "User not deleted."
                        }
                    }
                } else {
                    response = {
                        "error" : true,
                        "message" : "User not found."
                    }
                }
            }
            this.response.setHeader('Content-Type','application/json');
            this.response.end(JSON.stringify(response));
        });
}
