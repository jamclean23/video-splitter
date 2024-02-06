// Splits mp4 into specified number of clips

// ====== IMPORTS ======

const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');


// ====== GLOBAL VARS ======

// Determine if Development or Production
let MODE;
// CHANGE AFTER TESTING
MODE = 'dev';
// if (process.env.NODE_ENV === 'dev') {
//     console.log('DEVELOPMENT MODE');
//     MODE = 'dev';
// } else {
//     console.log('PRODUCTION MODE');
//     MODE = 'prod';
// }


// Determine where to manage temp files
let TEMP_PATH;
let FFMPEG_PATH;
if (MODE === 'dev') {
    TEMP_PATH = path.join(process.cwd(), 'temp');
    FFMPEG_PATH = path.join(process.cwd(), 'lib/ffmpeg/bin');
} else {
    TEMP_PATH = path.join(process.cwd());
    FFMPEG_PATH = path.join(process.cwd(), 'resources/lib/ffmpeg/bin');
}

// ====== TEST ======
splitMP4(path.join(process.cwd(), 'electron/functions', '../../test_input/test.mp4'), 4, './test_output');

// ====== FUNCTIONS ======

async function splitMP4(inputFilePath, numOfClips = 1, outputFolderPath) {
    
    // Get total duration of clip
    let duration;
    try {
        duration = await getDuration(inputFilePath);
    } catch (err) {
        console.log(err);
    }

    // Divide into pieces to get clips length
    const clipsLength = getClipsLength(duration, numOfClips);

    // Separate clips into approximate chunks desired
    try {
        await seperateClips(inputFilePath, clipsLength, outputFolderPath);
    } catch (err) {
        console.log(err);
    }

    // Check for a remainder clip. Concat with the second to last clip
    try {
        await joinRemainder(outputFolderPath, numOfClips);
    } catch (err) {

    }

    // WRITE TXT
    // const inputFiles = [
    //     `file '${path.join(__dirname, `../../output_003.mp4`)}'`,
    //     `file '${path.join(__dirname, `../../output_004.mp4`)}'`
    // ];

    // await fs.promises.writeFile(path.join(__dirname, 'files.txt'), inputFiles.join('\r\n'), {
    //     encoding: "utf-8"
    // });

    // COMBINE TWO CLIPS
    // const txtFilePath = path.join(__dirname, 'files.txt');
    // const outputFile = path.join(__dirname, 'output.mp4');
    // const child2 = exec(`ffmpeg -f concat -safe 0 -i ${txtFilePath} -c copy ${outputFile}`);
    // child2.stdout.on('data', (data) => {
    //     console.log(data);
    // })
    // child2.stderr.on('data', (data) => {
    //     console.log(data);
    // })

    // Get duration of video
    function getDuration (inputFilePath) {
        console.log(FFMPEG_PATH);
        return new Promise((resolve, reject) => {
            const command = `"${FFMPEG_PATH}\\ffprobe.exe" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${inputFilePath}`;
            const child = exec(command);

            child.stdout.on('data', (data) => {
                resolve(data);
            });

            child.stderr.on('data', (data) => {
                console.log('Error getting duration');
                reject(data);
            });

            child.on('close', (code) => {
                reject('No response');
            });
        });
    }

    function getClipsLength (duration, numOfClips) {        
        return Math.floor(+duration/numOfClips);
    }

    function seperateClips (inputFilePath, clipsLength, outputFolderPath) {
        
        // Create directory
        async function createDir (tries = 0) {

            let newDirName = 'output' + (tries ? `(${tries})` : '');
            let dirExists = false;
            try {
                const stats = await fs.promises.stat(path.join(outputFolderPath, newDirName));
                dirExists = Boolean(stats);
            } catch (err) {
            }
            console.log('DIR EXISTS ' + dirExists);
            
            if (dirExists) {
                createDir(tries + 1);
            } else {
                await fs.promises.mkdir(path.join(outputFolderPath, newDirName));
            }

            return;
        }




        return new Promise((resolve, reject) => {

            const child = exec(`ffmpeg -i ${inputFilePath} -map 0 -c copy -f segment -segment_time ${clipsLength} -reset_timestamps 1 ${outputFolderPath}/output_%03d.mp4`);
            
            child.stdout.on('data', (data) => {
                // console.log(data);
            })
            child.stderr.on('data', (data) => {
                // console.log(data);
                reject(data);
            })
            child.on('close', () => {
                resolve();
            })
        });
    }

    async function joinRemainder (outputFolderPath, numOfClips) {
        const toJoinClipsPaths = await getToJoinClipsPaths(outputFolderPath, numOfClips);

        async function getToJoinClipsPaths (outputFolderPath) {
            const filesAndFolders = await fs.promises.readdir(outputFolderPath);
            
            console.log(filesAndFolders);
        }
    }
}

// ====== EXPORTS ======

