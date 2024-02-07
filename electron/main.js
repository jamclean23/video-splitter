// Entry point for electron


// ====== IMPORTS ======

// Electron 
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

// System
const path = require('path');
const fs = require('fs');

// Functions
const splitVideo = require('./functions/splitVideo.js');


// ====== GLOBAL VARS ======

let MODE;
if (process.env.NODE_ENV === 'dev') {
    console.log('MAIN DEVELOPMENT MODE');
    MODE = 'dev';
} else {
    console.log('MAIN PRODUCTION MODE');
    MODE = 'prod';
}

let RESOURCE_PATH;
if (MODE === 'dev') {
    RESOURCE_PATH = './lib';
} else {
    RESOURCE_PATH = path.join(process.cwd(), 'resources/lib/');
}


// ====== FUNCTIONS ======

async function main () {
    
    // Waits for app to be ready and display window
    await app.whenReady()
    const win = createWindow(1000, 600, './templates/index/index.html', true);

    // Add event listeners to app
    addEventListeners();

}

/**
 * @param {Number} width - Initial width of browser window
 * @param {Number} height - Initial height of the browser window
 * @param {String} template - Path to html file
 * @param {Boolean} toolbar - If false, removes toolbar from browser window
 * @returns Electron window object
 */
function createWindow (width = 600, height = 300, template, toolbar = true) {

    // Initialize a new browser window object
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        width,
        height,
        minWidth: width/2 + 100,
        minHeight: height
    });

    // Sets template if provided
    if (template) {
        win.loadFile(template);
    }

    // Removes menubar if specified
    if (!toolbar) {
        win.setMenu(null);
    }

    return win;
}

function addEventListeners () {

    // Process video into clips
    ipcMain.handle('process', async (event, config) => {
        console.log('\nProcessing...');
        console.log(config);
        console.log('\n');
        try {
            await splitVideo(config.inputPath, config.numOfClips, config.outputPath);
        } catch (err) {
            console.log('Error processing video');
            console.log(err);
            return 'error';
        }
        console.log('Done.');
        return 'success';
    });

    // Input file dialog
    ipcMain.handle('input-dialog', async (event) => {
        let inputPath;
        try {
            inputPath = await dialog.showOpenDialog({
                title: 'Choose an Mp4 Video to Split',
                properties: [
                    'openFile'
                ],
                filters: [
                    { name: `Mp4's`, extensions: ['mp4'] }
                ]
            });
        } catch (err) {
            console.log(err);
        }

        if (inputPath) {
            return inputPath.filePaths[0];
        } else {
            return '';
        }

    });

    // Output destination dialog
    ipcMain.handle('output-dialog', async (event) => {
        let outputPath;
        try {
            outputPath = await dialog.showOpenDialog({
                title: 'Choose a Destination Folder',
                properties: [
                    'openDirectory'
                ]
            });
        } catch (err) {
            console.log(err);
        }

        if (outputPath) {
            return outputPath.filePaths[0];
        } else {
            return '';
        }

    })

    // Test ipc TEST FUNCTION
    ipcMain.handle('test', (event)=> {
        
        const responses = [
            'Hello!',
            'Hi!',
            'Boy howdy!',
            'Top of the morning!',
            'Buenos Dias!'
        ];

        const randomIndex = Math.floor(Math.random()*5);

        return responses[randomIndex];
    });


    // Check resources TEST FUNCTION
    ipcMain.handle('check-resource', async (event) => {
        console.log('Checking resource path...');
        let blahObj;
        try {
            try {
                // Attempt to access dev files
                console.log(process.env.NODE_ENV);
                console.log(MODE);
                console.log(RESOURCE_PATH);
                blahObj = JSON.parse(await fs.promises.readFile(path.join(RESOURCE_PATH, 'blah.json'), 'utf-8'));
            } catch (err) {
                // If failed, attempt to access prod files
                try {
                    blahObj = JSON.parse(await fs.promises.readFile(path.join(RESOURCE_PATH), 'utf-8'));
                } catch (err) {
                    throw new Error(`Unable to find dev or prod files`);
                }
            }

            console.log('result: ' + blahObj);
        } catch (err) {
            console.log(err);
            return 'An error occured' + err.toString();
        }
        if (blahObj.blah) {
            return blahObj.blah;
        } else {
            return 'Failed to find blah.json at ' + localPath;
        }
    });

    // Mac OS kills process when window closed
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    })
}

function setMenu (win) {
    win.setMenu(null);
}

// ====== MAIN ======

main();

