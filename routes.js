/*
 * Title: Routes
 * Description: Application Routes
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

// dependencies
const { sampleHandler } = require('./handlers/routesHandlers/sample_handler');
const { userHandler } = require('./handlers/routesHandlers/user_handler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
