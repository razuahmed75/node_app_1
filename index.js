/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links.
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    http.createServer(app.handleReq).listen(app.config.port);
    console.log(`listening to port ${app.config.port}`);
};

// handle request response
app.handleReq = handleReqRes;

// start the server
app.createServer();
