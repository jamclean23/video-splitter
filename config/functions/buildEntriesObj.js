// Builds entries object for webpack config

// ====== FUNCTIONS ======

/**
 * 
 * @param {Array} dirNames - Array of strings. Names of directories to use as entry points. 
 * @returns {Object} Entry points for a webpack config file
 */
function buildEntriesObj (dirNames) {

    if (!Array.isArray(dirNames)) {
        throw new Error('Provided dirNames was not an array.');
    }

    const result = {};

    dirNames.forEach((dirName) => {
        result[`/${dirName}/${dirName}`] = `./src/${dirName}/${dirName}.js`;
    });

    return result;
}


// ====== EXPORTS ======

module.exports = buildEntriesObj;