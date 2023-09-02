//--------------------------------------------
//Title: hochdoerfer-composer-routes.js
//Author: Kyle Hochdoerfer
//Date: 08/30/23
//Description: Routing for composer API operations
//---------------------------------------------

//Create variables to require express, router, and the composer model
const express = require('express');
const router = express.Router();
const Composer = require('../models/hochdoerfer-composer');

/**
 * findAllComposers
 * @openapi
 * /api/composers:
 *   get:
 *     tags:
 *       - Composers
 *     description: API for returning an array of composer objects.
 *     summary: returns an array of composers in JSON format.
 *     responses:
 *       '200':
 *         description: Array of composers.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.get('/composers', async(req, res) => {
    try {
        //Find all composer documents from the database
        Composer.find({}, function(err, composers) {
            //If MongoDB encounters an error
            if (err) {
                //Output an error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the list of all composers and send it as a JSON response
                console.log(composers);
                res.json(composers);
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
 * findComposerById
 * @openapi
 * /api/composers/{id}:
 *   get:
 *     tags:
 *       - Composers
 *     description:  API for returning a composer document
 *     summary: returns a composer document
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Composer document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer document
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/composers/:id', async(req, res) => {
    try {
        //Find the composer matching the provided id parameter
        Composer.findOne({'_id': req.params.id}, function(err, composer) {
            //If MongoDB encounters an error
            if (err) {
                //Output an error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the composer JSON to the console and send it as a response
                console.log(composer);
                res.json(composer);
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
 * createComposer
 * @openapi
 * /api/composers:
 *   post:
 *     tags:
 *       - Composers
 *     name: createComposer
 *     description: API for adding a new composer document to MongoDB Atlas
 *     summary: Creates a new composer document
 *     requestBody:
 *       description: Composer information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Composer added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/composers', async(req, res) => {
    try {
        //Create a new composer object using the request's parameters
        const newComposer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }

        //Await a response from the server
        await Composer.create(newComposer, function(err, composer) {
            //If MongoDB encounters an error
            if (err) {
                //Output the error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the new composer JSON, and send it as a response
                console.log(composer);
                res.json(composer);
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