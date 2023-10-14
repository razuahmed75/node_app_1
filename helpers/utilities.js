/*
 * Title: Utilites
 * Description: important utilities function
 * Author: Razu ahmed
 * Date: 27/9/23
 *
 */

// dependencies
const crypto = require('crypto');
const environments = require('./environments');

// module scaffolding
const utilities = {};

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
};

// hash string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.trim().length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    } else {
        false;
    }
};

// create random string
utilities.createRandomString = (strLen) => {
    let strln = typeof strLen === 'number' ? strLen : false;

    if (strln) {
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let output = '';

        for (let i = 0; i < strln; i += 1) {
            let randomChar = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomChar;
        }
        return output;
    }
};

// export module
module.exports = utilities;
