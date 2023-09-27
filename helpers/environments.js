/*
 * Title: Environments
 * Description: Handle all environment related things.
 * Author: Razu ahmed
 * Date: 24/9/23
 *
 */

// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3200,
    envName: 'staging',
    secretKey: '3ejzitl47kLme7Hk9Ghzy0s',
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: '9EizBvl07tLme7pk9Ghzy2g',
};

// determine which environment was passed
let currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
let environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;
