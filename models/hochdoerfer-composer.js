//--------------------------------------------
//Title: composer.js
//Author: Kyle Hochdoerfer
//Date: 08/30/23
//Description: Mongoose model for composers
//---------------------------------------------

//Declare variables to require mongoose and to create a schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Declare a new composer schema with a first name and last name
let composerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String }
});

//Export the composer model
module.exports = mongoose.model('Composer', composerSchema);