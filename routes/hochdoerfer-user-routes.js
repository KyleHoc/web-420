//--------------------------------------------
//Title: hochdoerfer-user-routes.js
//Author: Kyle Hochdoerfer
//Date: 09/13/23
//Description: Routing for user API operations
//---------------------------------------------

//Require express, the User model, bcrypt, and declare a router variable
const express = require('express');
const router = express.Router();
const User = require('../models/hochdoerfer-user');
const bcrypt = require('bcryptjs');

//Declare a saltRounds variable
const saltRounds = 10;

/**
 * signup
 * @openapi
 * /api/signup:
 *   post:
 *     tags:
 *       - Users
 *     name: signup
 *     summary: Register user
 *     requestBody:
 *       description: User information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *               - password
 *               - emailAddress
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               emailAddress:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *     responses:
 *       '200':
 *         description: User added to MongoDB
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/signup', async(req, res) => {
    try {
        //Note: I set it up like this because I was having a hard time getting it to determine if the user
        //      was already in the database or not and the await User.create function did not want to work when
        //      everything was nested inside the User.findOne query, I had to use a promise
        //      and change my code a little to make it run properly

        //Create a Promise to check if the username is in use
        const usernamePromise = new Promise((resolve, reject) => {
            //Query the database to determine if the request body username is present
            User.findOne({'username': req.body.username}, function(err, user) {
              //If an error occurs, then reject the promise
              if (err){
                reject(err)
              };

              //If the username is already present:
              if (Boolean(user)) {
                //Return true
                resolve(true)
              } else {
                //Return false
                resolve(false);
              }
            });
        })
        
        //Assign the result of the promise to a variable
        let existingUser = await usernamePromise;

        //If the new username is not already in use
        if (!existingUser) {
            //Create a hashed password variable using brcypt and the request body
            const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

            //Create a new registered user object using the hashed password and request body
            const newRegisteredUser = {
                username: req.body.username,
                password: hashedPassword,
                emailAddress: req.body.emailAddress
            } 

            //Await a response
            await User.create(newRegisteredUser, function(err, user) {
                //If MongoDB encounters an error
                if (err) {
                    //Output the MongoDB error message to the console and send it as a response
                    console.log(err);
                    res.status(501).send({
                        'message': `MongoDB Exception: ${err}`
                    })
                } else {
                    //If the operation is successful, output the new user info and send its JSON as a response
                    console.log(user);
                    res.json(user);
                }
            })
        } else {
            //If the username already in use, output an error message and send it as a response
            console.log('Username is already in use');
            res.status(401).send({
                'message': `Username is already in use`
            })
        }
    } catch (e) {
        //If the server encounters an error, output the message and send it as a response
        console.log(e);
        res.status(500).send({
            'message': `Server Excpetion: ${e.message}`
        })
    }
})

/**
 * login
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Users
 *     name: Login user
 *     summary: Logs the user in
 *     requestBody:
 *       description: User information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in
 *       '401':
 *         description: Invalid username or password
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/login', async(req, res) => {
    try {
        //Query the database for a user with the username in the request body
        User.findOne({'username': req.body.username}, function(err, user) {
            //If MongoDB encounters an error, output the message and send it as a response
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                //Otherwise, if the user is valid:
                if (user) {
                    //Determine if the request body password is valid and save the boolean result
                    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

                    //If the password is valid
                    if (passwordIsValid) {
                        //Output a message stating that the user has logged in and send it as a response
                        console.log('User logged in');
                        res.status(200).send({
                            'message': 'User logged in'
                        })
                    } else {
                        //If the password is invalid, output an error message and send it as a response
                        console.log('Invalid username and/or password');
                        res.status(401).send({
                            'message': `Invalid username and/or password`
                        })
                    }
                } else {
                    //If the username is invalid, output an error message and send it as a response
                    console.log('Invalid username and/or password');
                    res.status(401).send({
                        'message': `Invalid username and/or password`
                    })
                }
            }
        })
    } catch (e) {
        //If the server encounters an error, output the message and send it as a response
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e}`
        })
    }
})

//Set the module exports to the router variable
module.exports = router;