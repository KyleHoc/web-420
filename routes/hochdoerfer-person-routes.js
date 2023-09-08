//--------------------------------------------
//Title: hochdoerfer-person-routes.js
//Author: Kyle Hochdoerfer
//Date: 09/06/23
//Description: Routing for person API operations
//---------------------------------------------

//Create variables to require express, router, and the person model
const express = require('express');
const router = express.Router();
const person = require('../models/hochdoerfer-person');

/**
 * findAllPersons
 * @openapi
 * /api/persons:
 *   get:
 *     tags:
 *       - Persons
 *     description: API for returning an array of person objects.
 *     summary: returns an array of persons in JSON format.
 *     responses:
 *       '200':
 *         description: Array of persons.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.get('/persons', async(req, res) => {
    try {
        //Find all person documents from the database
        person.find({}, function(err, persons) {
            //If MongoDB encounters an error
            if (err) {
                //Output an error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the list of all persons and send it as a JSON response
                console.log(persons);
                res.json(persons);
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
 * createPerson
 * @openapi
 * /api/persons:
 *   post:
 *     tags:
 *       - Persons
 *     name: createPerson
 *     description: API for adding a new person document to MongoDB Atlas
 *     summary: Creates a new person document
 *     requestBody:
 *       description: person information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - roles
 *               - dependents
 *               - birthDate
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *               dependents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *               birthDate:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Person added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/persons', async(req, res) => {
    try {
        //Create a new person object using the request's parameters
        const newPerson = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            roles: req.body.roles,
            dependents: req.body.dependents,
            birthDate: req.body.birthDate
        }

        //Await a response from the server
        await person.create(newPerson, function(err, person) {
            //If MongoDB encounters an error
            if (err) {
                //Output the error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the new person JSON, and send it as a response
                console.log(person);
                res.json(person);
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