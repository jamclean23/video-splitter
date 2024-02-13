// Retrieves specified number of last lines of a utf-8 encoded file, given the file path


// ====== IMPORTS ======

const fs = require('fs');
const path = require('path');
const MAX_BUFFER_SIZE = 1024;


// ====== FUNCTIONS ======

// Exported function
/**
 * 
 * @param {String} pathToFile - Path to the file to be read
 * @param {Number} requestedLines - The amount of lines counted from the bottom of the file to be read
 * @returns Lines read from the text file || null
 */
async function getLastLines (pathToFile, requestedLines) {
    // Retrieve the file descriptor
    let fileDescriptor;
    try {
        fileDescriptor = await getFileDescriptor(pathToFile);
    } catch (err) {
        throw new Error(err);
    }

    if (!fileDescriptor) {
        throw new Error('Progress.log not found');
    }
    console.log('FILE DESCRIPTOR: ' + fileDescriptor);

    // Retrieve the size of the file
    let fileSize;
    try {
        fileSize = await getSizeFromFD(fileDescriptor);
    } catch (err) {
        throw new Error(err);
    }

    if (!fileSize) {
        throw new Error('File empty');
    }
    console.log('FILE SIZE: ' + fileSize);

    // Calculate the size of the buffer
    const initialBufferSize = getBufferSize(MAX_BUFFER_SIZE, fileSize);
    console.log('INITIAL BUFFER SIZE: ' + initialBufferSize);

    // Calculate starting position for read operation
    const startingPos = getStartingPosition(fileSize, initialBufferSize);
    console.log('STARTING READ POSITION: ' + startingPos);

    // Read lines
    const config = {
        fileDescriptor,
        bufferSize: initialBufferSize,
        position: startingPos,
        requestedLines
    }
    const lines = await recurseData(config);
    // console.log('\n====== LINES ======');
    // console.log(lines);

    // Close file
    closeFile(fileDescriptor);

    // Return results
    return lines;
}

// Internal functions
function getFileDescriptor (pathToFile) {
    return new Promise((resolve, reject) => {

        fs.open(pathToFile, 'r', (err, fileDescriptor) => {
            if (err) {
                closeFile(fileDescriptor);
                reject(err);
            }
            resolve(fileDescriptor);
        })
    });
}

function getSizeFromFD (fileDescriptor) {
    return new Promise((resolve, reject) => {
        fs.fstat(fileDescriptor, (err, stats) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            resolve(stats.size);
        })
    });
}

function getBufferSize (maxBufferSize, fileSize) {
    return Math.min(maxBufferSize, fileSize);
}

function getStartingPosition (fileSize, initialBufferSize) {
    return fileSize - initialBufferSize - 1;
}

function closeFile (fileDescriptor) {
    fs.close(fileDescriptor, (err) => {
        if (err) {
            console.log(err);
        }
    })
}

/**
 * 
 * @param {Object} config - The Configuration object.
 * @param {Number} config.fileDescriptor - File descriptor for the file to be accessed.
 * @param {Number} config.initialBufferSize - Starting size of the buffer.
 * @param {Number} config.startingPos - Initial starting position
 * @param {*} accumulatorObj 
 */
async function recurseData (
    config,
    accumulatorObj = {
        leftover: '',
        lines: [],
        linesCount: 0
    }   
) {
    console.log('\n=== Reading a Chunk ===');
    const params = {
        fileDescriptor: config.fileDescriptor,
        bufferSize: config.bufferSize,
        position: config.position,
        requestedLines: config.requestedLines
    }

    console.log('\ninitial:');
    console.log(params);

    // If position = 0, then this is the last run
    let lastRun = params.position ? false : true;

    // Initialize the read buffer
    const buffer = Buffer.alloc(params.bufferSize);

    // Get data for current chunk
    const data = await waitForRead(params, buffer);
    console.log('Data:');
    console.log(data);

    // Check for lines, add to accumulator, increment counter if lines
    const newLines = (data + accumulatorObj.leftover).split('\n');
    accumulatorObj.leftover = newLines.shift();
    accumulatorObj.lines = newLines.concat(accumulatorObj.lines).filter((line) => {
        // filter out empty lines
        return line.length;
    });
    accumulatorObj.linesCount = accumulatorObj.linesCount + newLines.length;

    console.log('\ntest:');
    console.log(params);

    // Check if the function has found enough lines
    if (accumulatorObj.linesCount > params.requestedLines) {
        return accumulatorObj.lines.slice(-params.requestedLines);
    }


    // If this is the last run, add leftover as a line and return
    if (lastRun) {
        accumulatorObj.linesCount++;
        accumulatorObj.lines.unshift(accumulatorObj.leftover);
        return accumulatorObj.lines;
    }

    // Find a a new starting position
    const newPosition = params.position - params.bufferSize;
    if (newPosition < 0) {
        params.bufferSize = params.bufferSize - params.position;
        params.position = 0;
    } else {
        params.position = newPosition;
    }

    // Recurse and return result
    console.log('\nTo pass:');
    console.log(params);
    let result;
    try {
        result = await recurseData(params, accumulatorObj);
    } catch (err) {
        console.log(err);
    }
    return result;
}

async function waitForRead(params, buffer) {
    return new Promise((resolve, reject) => {
      fs.read(params.fileDescriptor, buffer, 0, params.bufferSize, params.position, (err, bytesRead, buffer) => {
        if (err) {
          console.error('Error reading file:', err);
          fs.close(fd, () => {});
          reject('Error reading file');
        }
        
        if (bytesRead === 0) {
          // End of file
          fs.close(fd, () => {
          });
          resolve()
        }
        
        // Data read this chunk
        const data = buffer.toString('utf8', 0, bytesRead);
        resolve(data);
      });
    });
}


// ====== EXPORTS ======

module.exports = getLastLines;

// TEST

test();

async function test () {
    const lines = await getLastLines(path.join(__dirname, '../../test_temp/progress.log'), 9);
    console.log('TEST');
    console.log(lines);
}