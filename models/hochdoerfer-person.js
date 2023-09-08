//--------------------------------------------
//Title: hochdoerfer-person.js
//Author: Kyle Hochdoerfer
//Date: 09/06/23
//Description: Mongoose model for people
//---------------------------------------------

//Declare variables to require mongoose and to create a schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Declare a new role schema with a text field
let roleSchema = new Schema({
    text: { type: String }
});

//Declare a dependent schema with fields for first and last name
let dependentSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String }
});

//Declare a person scheme with first and last name fields, roles, dependents, and birth date
let PersonSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    roles: [roleSchema],
    dependents: [dependentSchema],
    birthDate: { type: String }
});

//Export the Person model
module.exports = mongoose.model('Person', PersonSchema);