/*
 * Title: Token Handler
 * Description: Handler to handle token ralated routes
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

// dependencies
const { hash, parseJSON } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');
const data = require('../../lib/data');
// const { parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method is not accepted',
        });
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : null;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : null;
    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            if (!err1) {
                let hashedPassword = hash(password);
                if (hashedPassword === parseJSON(userData).password) {
                    let tokenId = createRandomString(20);
                    let expires = Date.now() + 60 * 60 * 1000;

                    let tokenObject = {
                        id: tokenId,
                        phone,
                        expires,
                    };

                    // store to the db
                    data.create('tokens', tokenId, tokenObject, (err2) => {
                        if (!err2) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { error: 'There was a problem in server site' });
                        }
                    });
                } else {
                    callback(400, { error: 'Password is not valid!' });
                }
            } else {
                callback(500, { error: 'There was an error in server site' });
            }
        });
    } else {
        callback(400, { error: 'You have a problem in your request!' });
    }
};

handler._token.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        data.read('tokens', id, (err, t) => {
            const token = { ...parseJSON(t) };
            if (!err && t) {
                callback(200, token);
            } else {
                callback(404, { error: 'Requested user was not found!' });
            }
        });
    } else {
        callback(404, { error: 'Requested user was not found!' });
    }
};

handler._token.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;

    let extend =
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
            ? true
            : false;

    if (id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
            if (!err1) {
                let tokenObject = parseJSON(tokenData);
                if (tokenObject.expires > Date.now()) {
                    tokenObject.expires = Date.now() + 60 * 60 * 1000;
                    data.update('tokens', id, tokenObject, (err2) => {
                        if (!err2) {
                            callback(200, { message: 'Token updated successfully' });
                        } else {
                            callback(500, { error: 'There was a problem in server site' });
                        }
                    });
                } else {
                    callback(404, { error: 'Token already expired!' });
                }
            } else {
                callback(500, { error: 'There was a problem in server site' });
            }
        });
    } else {
        callback(404, { error: 'Requested token was not found' });
    }
};

handler._token.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    data.read('tokens', id, (err1, tokenData) => {
        if (!err1 && tokenData) {
            data.delete('tokens', id, (err2) => {
                if (!err2) {
                    callback(200, { message: 'Token deleted successfully' });
                } else {
                    callback(500, { error: 'There was a problem in sever site' });
                }
            });
        } else {
            callback(404, { error: 'Token not found' });
        }
    });
};

handler._token.verify = (token, phone, callback) => {
    data.read('tokens', token, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback('failed');
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
