//--------------------------------------------
//Title: hochdoerfer-team.js
//Author: Kyle Hochdoerfer
//Date: 10/03/23
//Description: Mongoose model for teams
//---------------------------------------------

//Declare variables to require mongoose and to create a schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Declare a new player schema with firstName, lastName, and salary
let playerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    salary: { type: Number}
});

//Declare a new team schema with a name, mascot, and players
let teamSchema = new Schema({
    name: { type: String },
    mascot: { type: String },
    players: [playerSchema]
});

//Export the team model
module.exports = mongoose.model('Team', teamSchema);