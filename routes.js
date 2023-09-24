/*
 * Title: Routes
 * Description: Application Routes
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

// dependencies
const { sampleHandler } = require('./handlers/routesHandlers/sample_handlers');

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
