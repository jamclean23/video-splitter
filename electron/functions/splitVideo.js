// Splits mp4 into specified number of clips

// ====== IMPORTS ======

const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');


// ====== GLOBAL VARS ======

// Determine if Development or Production
let MODE;
if (process.env.NODE_ENV === 'dev') {
    // console.log('SPLIT VIDEO DEVELOPMENT MODE');
    MODE = 'dev';
} else {
    // console.log('SPLIT VIDEO PRODUCTION MODE');
    MODE = 'prod';
}

// COMMENT OUT FOR TESTING
// MODE = 'dev';

// Determine where to manage temp files
let TEMP_PATH;
let FFMPEG_PATH;
if (MODE === 'dev') {
    TEMP_PATH = path.join(process.cwd(), 'test_temp');
    FFMPEG_PATH = path.join(process.cwd(), 'lib/ffmpeg/bin');
} else {
    TEMP_PATH = path.join(process.cwd());
    FFMPEG_PATH = path.join(process.cwd(), 'resources/lib/ffmpeg/bin');
}

// ====== TEST ======
// splitMP4(path.join(process.cwd(), 'test_input', 'test.mp4'), 6, path.join(process.cwd(), '/test_output'));

// ====== FUNCTIONS ======

/**
 * 
 * @param {String} inputFilePath - Path to mp4 to be used as input
 * @param {Number} numOfClips - The amount of desired clips 
 * @param {String} outputFolderPath - The folder where the new output folder will be generated
 */
async function splitMP4(inputFilePath, numOfClips = 1, outputFolderPath) {
    try {
        await setup();
    } catch (err) {
        console.log(err);
    }

    // Get total duration of clip
    let duration;
    try {
        duration = await getDuration(inputFilePath);
    } catch (err) {
        console.log('Duration error');
        console.log('Attempted to access file at : ' + inputFilePath);
        console.log(err);
        throw new Error(err);
    }

    // Divide into pieces to get clips length
    const clipsLength = getClipsLength(duration, numOfClips);

    // Separate clips into approximate chunks desired, return the name of output directory
    let newDirName;
    try {
        newDirName = await seperateClips(inputFilePath, clipsLength, outputFolderPath);
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }

    // Check for a remainder clip in the new directory. Concat with the second to last clip
    let cleanupObj;
    try {
        cleanupObj = await joinRemainder(path.join(outputFolderPath, newDirName), numOfClips, outputFolderPath);
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }

    // Cleanup
    try {
        await cleanup(cleanupObj, newDirName, outputFolderPath);
    } catch (err) {
        console.log(err);
        // throw new Error(err);
    }

    return {
        duration: duration.toString('utf-8')
    }

    // Get duration of video
    function getDuration (inputFilePath) {
        return new Promise((resolve, reject) => {

            const command = [
                `${FFMPEG_PATH}\\ffprobe.exe`,
                '-v', 'error',
                '-show_entries', 'format=duration',
                '-of', 'default=noprint_wrappers=1:nokey=1',
                inputFilePath
            ];
            
            const child = spawn(command[0], command.slice(1));

            child.on('error', (err) => {
                throw new Error(err);
            });

            child.stdout.on('data', (data) => {
                resolve(data);
            });

            child.stderr.on('data', (data) => {
                console.log('Error getting duration');
                reject(data);
            });

            child.on('close', (code) => {
                reject('Error getting duration');
            });
        });
    }

    function getClipsLength (duration, numOfClips) {        
        return Math.floor(+duration/numOfClips);
    }

    async function seperateClips (inputFilePath, clipsLength, outputFolderPath) {
        
        let newDirName;
        try {
            newDirName = await createDir(outputFolderPath);
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }

        // Create directory
        async function createDir (outputFolderPath, tries = 0) {

            let newDirName = 'output' + (tries ? `(${tries})` : '');
            let dirExists = false;
            try {
                const stats = await fs.promises.stat(path.join(outputFolderPath, newDirName));
                dirExists = Boolean(stats);
            } catch (err) {
            }
            
            if (dirExists) {
                newDirName = await createDir(outputFolderPath, tries + 1);
            } else {
                await fs.promises.mkdir(path.join(outputFolderPath, newDirName));
                return newDirName;
            }

            return newDirName;
        }


        
        
        
        return new Promise((resolve, reject) => {

            console.log('JOINING CLIPS');

            const command = [
                `${FFMPEG_PATH}\\ffmpeg.exe`,
                '-i', inputFilePath,
                '-map', '0',
                '-c', 'copy',
                '-f', 'segment',
                '-segment_time', clipsLength,
                '-progress', path.join(TEMP_PATH, 'progress.log'),
                '-reset_timestamps', '1',
                `${outputFolderPath}\\${newDirName}\\output_%03d.mp4`
            ];
            
            const child = spawn(command[0], command.slice(1));
            
            child.on('error', (err) => {
                throw new Error(err);
            });
            
            child.stdout.on('data', (data) => {
                // console.log(data.toString('utf-8'));
            })
            child.stderr.on('data', (data) => {
                // console.log(data.toString('utf-8'));
            })
            child.on('close', () => {
                console.log('CLOSING');
                resolve(newDirName);
            })
        });
    }

    async function joinRemainder (newDirPath, numOfClips, outputFolderPath) {

        let toJoinClipsPaths;
        try {
            toJoinClipsPaths = await getToJoinClipsPaths(newDirPath, numOfClips);
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
        

        if (!toJoinClipsPaths) {
            return;
        }

        try {
            await writeFilesConfig(toJoinClipsPaths, newDirPath);
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }

        let newClipName;
        try {   
            newClipName = await joinClips(toJoinClipsPaths, newDirPath);
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }

        return {
            newClipName,
            toJoinClipsPaths
        }

        async function getToJoinClipsPaths (newDirPath, numOfClips) {
            // Get contents of directory
            let filesAndFolders;
            try {
                filesAndFolders = await fs.promises.readdir(newDirPath);
            } catch (err) {
                console.log(err);
                throw new Error(err);
            }

            // Filter mp4s
            const mp4Regex = /\.mp4$/i;
            const clips = filesAndFolders.filter((item) => {
                return mp4Regex.test(item);
            });

            if (clips.length > numOfClips) {
                return clips.slice(-2);
            }
        }

        async function writeFilesConfig (toJoinClipsPaths, newDirPath) {

            // Format lines
            let inputFiles = [];
            toJoinClipsPaths.forEach((filePath) => {
                inputFiles.push(`file '${path.join(newDirPath, filePath)}'`);
            });

            // Write txt file

            try {
                await fs.promises.writeFile(path.join(TEMP_PATH, 'files.txt'), inputFiles.join('\r\n'), {
                    encoding: "utf-8"
                });
            } catch (err) {
                console.log(err);
                throw new Error(err);
            }
        }

        function joinClips (toJoinClipsPaths, newDirPath) {
            return new Promise((resolve, reject) => {    
                // COMBINE TWO CLIPS
                const newClipName = 'combined.mp4';
                const txtFilePath = path.join(TEMP_PATH, 'files.txt');
                const outputFile = path.join(newDirPath, newClipName);

                const command = [
                    'ffmpeg',
                    '-f', 'concat',
                    '-safe', '0',
                    '-i', txtFilePath,
                    '-c', 'copy',
                    outputFile
                ];
                
                const child = spawn(command[0], command.slice(1));

                child.stdout.on('data', (data) => {
                    // console.log(data);
                })
                
                child.stderr.on('data', (data) => {
                    // console.log(data);
                })
                
                child.on('close', (code) => {
                    resolve(newClipName);
                })
            });
        }
    }

    async function setup () {
        // Delete progress.log
        try {
            if (fs.existsSync(path.join(TEMP_PATH, 'progress.log'))) {
                await clearFile(path.join(TEMP_PATH, 'progress.log'));

            }
        } catch (err) {
            console.log(err);
            console.log('Error deleting progress.log. May not indicate a problem.');
        }
    }

    async function cleanup (cleanupObj, newDirPath, outputFolderPath) {

        if (cleanupObj) {

            // Delete the old clips, now combined.
            for (let i = 0; i < cleanupObj.toJoinClipsPaths.length; i++) {
                try {
                    await deleteFile(path.join(outputFolderPath, newDirPath, cleanupObj.toJoinClipsPaths[i]));
                } catch (err) {
                    console.log(err);
                    throw new Error(err);
                }
            }

            // Rename combined clip to the first deleted clip
            try {
                await renameClip(path.join(outputFolderPath, newDirPath, cleanupObj.newClipName), path.join(outputFolderPath, newDirPath, cleanupObj.toJoinClipsPaths[0]));
            } catch (err) {
                console.log(err);
                throw new Error(err);
            }

        } else {
            // console.log('NO CLEANUP OBJ\nCould mean that an even number of clips were generated, or there was a problem.');
        }
        
        // Clear files.txt
        try {
            if (fs.existsSync(path.join(TEMP_PATH, 'files.txt'))) {
                await clearFile(path.join(TEMP_PATH, 'files.txt'));
            }
        } catch (err) {
            console.log('Error clearing files.txt');
        }

        async function renameClip (pathToFile, newNamePath) {
            await fs.promises.rename(pathToFile, newNamePath);
        }

    }

    // Put quotes around paths
    function addQuotes (pathName) {
        if (!pathName.includes(`"`)) {
            return `"${pathName}"`;
        }
        return pathName;
    }

    
    async function deleteFile (pathToFile) {
        try {
            await fs.promises.unlink(pathToFile);
        } catch (err) {
            console.log('Error deleting ' + pathToFile);
        }
    }

    async function clearFile (pathToFile) {
        try {
            await fs.promises.writeFile(pathToFile, '');
        } catch (err) {
            console.log(err);
        }
    }
}

// ====== EXPORTS ======

module.exports = splitMP4;