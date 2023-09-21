//--------------------------------------------
//Title: hochdoerfer-node-shopper-routes.js
//Author: Kyle Hochdoerfer
//Date: 09/18/23
//Description: Routing for customer API operations
//---------------------------------------------

//Create variables to require express, router, and the Customer model
const express = require('express');
const router = express.Router();
const Customer = require('../models/hochdoerfer-customer');

/**
 * createCustomer
 * @openapi
 * /api/customers:
 *   post:
 *     tags:
 *       - Customers
 *     name: createCustomer
 *     description: API for adding a new customer document to MongoDB Atlas
 *     summary: Creates a new customer document
 *     requestBody:
 *       description: Customer information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Customer added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/customers', async(req, res) => {
    try {
        //Create a new customer object using the request's parameters
        const newCustomer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username
        }

        //Await a response from the server
        await Customer.create(newCustomer, function(err, customer) {
            //If MongoDB encounters an error
            if (err) {
                //Output the error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the new person JSON, and send it as a response
                console.log(customer);
                res.json(customer);
            }
        })
    } catch (e) {
        //If the server encounters an error, output the message to the console and send it as a response
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

/**
 * createInvoiceByUserName
 * @openapi
 * /api/customers/{username}/invoices:
 *   post:
 *     tags:
 *       - Customers
 *     name: createInvoiceByUserName
 *     description: API for adding a new invoice document to MongoDB Atlas
 *     summary: Creates a new invoice to a customer document
 *     requestBody:
 *       description: invoice information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - invoices
 *             properties:
 *               username:
 *                 type: string
 *               subtotal:
 *                 type: string
 *               tax:
 *                 type: string
 *               dateCreated:
 *                 type: string
 *               dateShipped:
 *                 type: string
 *               lineItems:
 *                 type: array
 *                 items:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                    price:
 *                      type: number
 *                    quantity:
 *                      type: number
 *     responses:
 *       '200':
 *         description: Invoice added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/customers/:username/invoices', async(req, res) => {
    try {

        //Query the database to find the customer with the username provided
        Customer.findOne({'username': req.body.username}, function(err, customer) {
            //Create a new invoice object using the request body
            const newInvoice = {
                subtotal: req.body.subtotal,
                tax: req.body.tax,
                dateCreated: req.body.dateCreated,
                dateShipped: req.body.dateShipped,
                lineItems: req.body.lineItems
            }

            //Push the new invoice onto the customer's invoices array
            customer.invoices.push(newInvoice)

            //Call customer.save to add the new invoice to MongoDB
            customer.save(function(err, updatedCustomer) {
                if (err) {
                    //If MongoDB encounters an error, print the error and send it as a response
                    console.log(err);
                    res.status(501).send({
                        'message': `MongoDB Exception: ${err}`
                    })
                } else {
                    //Otherwise, print the updated customer and send it as a response
                    console.log(updatedCustomer);
                    res.json(updatedCustomer);
                }
            })
        })
    } catch (e) {
        //If the server encounters an error, output the message to the console and send it as a response
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

/**
 * findAllInvoicesByUserName
 * @openapi
 * /api/customers/{username}/invoices:
 *   get:
 *     tags:
 *       - Customers
 *     description:  API for returning invoices by username
 *     summary: Returns invoices for the given username
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Customer document username
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Invoices array
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/customers/:username/invoices', async(req, res) => {
    try {
        //Find the customer matching the provided username parameter
        Customer.findOne({'username': req.params.username}, function(err, customer) {
            //If MongoDB encounters an error
            if (err) {
                //Output an error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the invoices array to the console and send it as a response
                console.log(customer.invoices);
                res.json(customer.invoices);
            }
        })
    } catch (e) {
        //If the server encounters an error, output the message to the console and send it as a response
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

//Export module
module.exports = router;