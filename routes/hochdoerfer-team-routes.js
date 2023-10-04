//--------------------------------------------
//Title: hochdoerfer-team-routes.js
//Author: Kyle Hochdoerfer
//Date: 10/03/23
//Description: Routing for team API operations
//---------------------------------------------

//Create variables to require express, router, and the Team model
const express = require('express');
const router = express.Router();
const Team = require('../models/hochdoerfer-team');

/**
 * createTeam
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     name: createTeam
 *     description: API for adding a new team document to MongoDB Atlas
 *     summary: Creates a new team document
 *     requestBody:
 *       description: Team information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - mascot
 *             properties:
 *               name:
 *                 type: string
 *               mascot:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Team added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/teams', async(req, res) => {
    try {
        //Create a new team object using the request's parameters
        const newTeam = {
            name: req.body.name,
            mascot: req.body.mascot,
        }

        //Await a response from the server
        await Team.create(newTeam, function(err, team) {
            //If MongoDB encounters an error
            if (err) {
                //Output the error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the new person JSON, and send it as a response
                console.log(team);
                res.json(team);
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
 * findAllTeams
 * @openapi
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for returning a full array of all team objects
 *     summary: returns an array of teams in JSON format.
 *     responses:
 *       '200':
 *         description: Array of teams.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.get('/teams', async(req, res) => {
    try {
        //Find all team documents from the database
        Team.find({}, function(err, teams) {
            //If MongoDB encounters an error
            if (err) {
                //Output an error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the list of all teams and send it as a JSON response
                console.log(teams);
                res.json(teams);
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
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Teams
 *     name: assignPlayerToTeam
 *     description: API for updating an existing document in MongoDB.
 *     summary: Creates player document for the team with the provided id parameter. 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team ID to assign to
 *         schema: 
 *           type: string
 *     requestBody:
 *       description: Player to assign
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Player document
 *       '401':
 *         description: Invalid id
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/teams/:id/players', async(req, res) => {
    try {
        //Query the database to find the team with the id provided
        Team.findOne({'_id': req.params.id}, function(err, team) {
            //Create a new player object using the request body
            const newPlayer = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                salary: req.body.salary
            }

            //Push the new player onto the team's players array
            team.players.push(newPlayer)

            //Call team.save to add the new player to MongoDB
            team.save(function(err, updatedTeam) {
                if (err) {
                    //If MongoDB encounters an error, print the error and send it as a response
                    console.log(err);
                    res.status(501).send({
                        'message': `MongoDB Exception: ${err}`
                    })
                } else {
                    //Otherwise, print the new player and send it as a response
                    console.log(newPlayer);
                    res.json(newPlayer);
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
 * findAllPlayersByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags:
 *       - Teams
 *     description:  API for returning players by id
 *     summary: Returns players for the given team ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of player documents
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/teams/:id/players', async(req, res) => {
    try {
        //Find the team matching the provided id parameter
        Team.findOne({'_id': req.params.id}, function(err, team) {
            //If MongoDB encounters an error
            if (err) {
                //Output an error message to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, output the players array to the console and send it as a response
                console.log(team.players);
                res.json(team.players);
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
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     name: deleteTeamById
 *     description: API for deleting a document from MongoDB.
 *     summary: Removes a document from MongoDB.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the document to remove. 
 *         schema: 
 *           type: string
 *     responses:
 *       '200':
 *         description: Team deleted
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete('/teams/:id', async (req, res) => {
    try {
        //Store the requested team ID as a variable
        const teamId = req.params.id;
        console.log(teamId)

        //Find and delete the team document with the requested ID
        Team.findByIdAndDelete({'_id': teamId}, function(err, team) {
            if (err) {
                //If MongoDB encounters an error, output it to the console and send it as a response
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //If the document is successfully deleted, output it to the console and send it as a response
                console.log(team);
                res.json(team);
            }
        })
    } catch (e) {
        //If the server encounters an error, output it to the console and send it as a response
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

//Export module
module.exports = router;