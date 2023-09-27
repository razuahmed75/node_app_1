/*
 * Title: File System
 * Description: CRUD operation function
 * Author: Razu ahmed
 * Date: 27/9/23
 *
 */

// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // create file
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error while closing the new file');
                        }
                    });
                } else {
                    callback('Error while writing to new file');
                }
            });
        } else {
            callback('File already exists');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

// update existing file
lib.update = (dir, file, data, callback) => {
    // open the file
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    if (!err) {
                        // write to the file
                        fs.writeFile(fileDescriptor, stringData, (err2) => {
                            if (!err2) {
                                fs.close(fileDescriptor, (err3) => {
                                    if (!err3) {
                                        callback(false);
                                    } else {
                                        callback('Error while closing the file');
                                    }
                                });
                            } else {
                                callback('Error while writing to the file');
                            }
                        });
                    }
                } else {
                    callback('Error while truncating the file');
                }
            });
        } else {
            callback('Error while updating the  and may not exist');
        }
    });
};

// deleting existing file
lib.delete = (dir, file, callback) => {
    // unlink the file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error while deleting the file');
        }
    });
};

module.exports = lib;
