// Entry point for electron


// ====== IMPORTS ======

// System
const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, ipcMain } = require('electron');

// Global Vars
let MODE;
if (process.env.NODE_ENV === 'dev') {
    console.log('DEVELOPMENT MODE');
    MODE = 'dev';
} else {
    console.log('PRODUCTION MODE');
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
        height
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

    // Test ipc
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


    // Check resources
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

