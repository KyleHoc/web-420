//----------------------------------------------------------
// Title: app.js
// Author: Kyle Hochdoerfer
// Date: 08/14/23
// Description: App configuration
//----------------------------------------------------------

//Enable strict mode
"use strict";

//Require express, mongoose, http, swagger-ui-express and swagger-jsdoc
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//Create an app variable set to the express library
const app = express();

//Set the port to process.env.PORT || 3000
const PORT = process.env.PORT || 3000;

//App configuration for JSON and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Create an options object containing a title and version number
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WEB 420 RESTful APIs",
            version: "1.0.0",
        },
    },
    apis: ['./routes/*.js'],
};

//Declare an openapi specifications variable using the swaggerJsdoc library
const openapiSpecification = swaggerJsdoc(options);

//Wire the openapispecification variable to the app variable
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

//Create a server using the PORT
app.listen(PORT, () => {
    console.log('Application started and listening on PORT ' + PORT);
});
