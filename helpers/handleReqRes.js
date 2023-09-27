/*
 * Title: Request Handling
 * Description: Handling all request of Application
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

const url = require('url');
const { StringDecoder } = require('string_decoder');
const { notFoundHandler } = require('../handlers/routesHandlers/not_found_handler');
const routes = require('../routes');
const { parseJSON } = require('./utilities');

const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const queryStringObject = parsedUrl.query;
    const method = req.method.toLowerCase();
    const headers = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        queryStringObject,
        method,
        headers,
    };

    const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        requestProperties.body = parseJSON(realData);
        choosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // return the final response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;
