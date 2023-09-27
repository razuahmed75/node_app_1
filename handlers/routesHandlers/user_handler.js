/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method is not accepted',
        });
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : null;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : null;
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

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean'
            ? requestProperties.body.tosAgreement
            : null;

    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err1) => {
            if (err1) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'User created successfully' });
                    } else {
                        callback(500, { error: 'Could not create user!' });
                    }
                });
            } else {
                callback(400, { error: 'Already exist this account.' });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        data.read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) };
            if (!err && u) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, { error: 'Requested user was not found!' });
            }
        });
    } else {
        callback(404, { error: 'Requested user was not found!' });
    }
};

handler._users.put = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : '';

    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : '';

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : '';

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : '';

    if (phone) {
        if (firstName || lastName || password) {
            data.read('users', phone, (err1, uData) => {
                const userData = { ...parseJSON(uData) };
                if (!err1 && userData) {
                    userData.firstName = firstName;
                    userData.lastName = lastName;
                    userData.password = hash(password);

                    data.update('users', phone, userData, (err2) => {
                        if (!err2) {
                            callback(200, { message: 'Successfully updated' });
                        } else {
                            callback(500, {
                                error: 'There was a problem in your server site',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'You have a problem in your request',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You have a problem in your request',
            });
        }
    } else {
        callback(400, {
            error: 'You have a problem in your request!',
        });
    }
};

handler._users.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : '';
    if (phone) {
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                data.delete('users', phone, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'Successfully deleted' });
                    } else {
                        callback(500, { error: 'There was a problem in your server site' });
                    }
                });
            } else {
                callback(500, { error: 'There was a problem in your server site' });
            }
        });
    } else {
        callback(400, { error: 'There was a problem in your request!' });
    }
};

module.exports = handler;
