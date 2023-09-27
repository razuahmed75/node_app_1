/*
 * Title: User Handler
 * Description: Handler to handle user related routes
 * Author: Razu ahmed
 * Date: 27/9/23
 *
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

// app object - module scaffolding
const app = {};

// create server
app.createServer = () => {
    http.createServer(app.handleReq).listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle request response
app.handleReq = handleReqRes;

// start the server
app.createServer();
