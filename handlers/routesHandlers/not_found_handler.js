/*
 * Title: Not Found Handler
 * Description: 404 Not Found Handler
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(404, {
        message: 'Not found',
    });
};

module.exports = handler;
