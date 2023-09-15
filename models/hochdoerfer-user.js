//--------------------------------------------
//Title: hochdoerfer-user.js
//Author: Kyle Hochdoerfer
//Date: 09/13/23
//Description: Mongoose model for users
//---------------------------------------------

//Declare variables to require mongoose and to create a schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Declare a new user schema with a username, password, and email address
let userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    emailAddress: { type: Array }
});

//Export the user model
module.exports = mongoose.model('User', userSchema);