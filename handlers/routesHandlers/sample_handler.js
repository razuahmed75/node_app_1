/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(200, {
        message: 'This is sample url',
    });
};

module.exports = handler;
