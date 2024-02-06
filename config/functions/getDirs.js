// Returns names of directories in a given directory as strings, given a path

// ====== IMPORTS ======

const {readdirSync} = require('fs');
const path = require('path');


// ====== FUNCTIONS ======

/**
 * 
 * @param {String} path - Path to directory to be searched
 * @returns {Array} Array of directory names as strings
 */
function getDirectories (path) {
    console.log('PATH:' + path);
    let directories;

    try {
        directories = readdirSync(path, {withFileTypes: true})
            .filter((dir) => { return dir.isDirectory() && !(dir.name === 'assets') && !(dir.name === 'functions')})
            .map((dir) => dir.name);
        return directories;
    } catch (err) {
        console.log(err);
        return [];
    }
}


// ====== EXPORTS ======

module.exports = getDirectories;