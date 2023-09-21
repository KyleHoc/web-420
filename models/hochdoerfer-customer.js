//--------------------------------------------
//Title: hochdoerfer-customer.js
//Author: Kyle Hochdoerfer
//Date: 09/18/23
//Description: Mongoose model for customer invoices
//---------------------------------------------

//Declare variables to require mongoose and to create a schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Declare a new line item schema
let lineItemSchema = new Schema({
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number }
});

//Declare a new invoice schema
let invoiceSchema = new Schema({
    subtotal: { type: Number },
    tax: { type: Number },
    dateCreated: { type: String },
    dateShipped: { type: String },
    lineItems: [lineItemSchema]
});

//Declare a new customer schema
let customerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    invoices: [invoiceSchema]
});

//Export the user model
module.exports = mongoose.model('Customer', customerSchema);