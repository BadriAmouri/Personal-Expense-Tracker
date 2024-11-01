const { BrowserWindow } = require('electron');
const path = require('path');

class MainWindow {
    constructor() {
        this.win = null;
        this.createWindow();
    }

    createWindow() {
        this.win = new BrowserWindow({
            width: 600,
            height: 400,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'), // Adjusted path
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });

        this.win.loadFile('index.html'); // Assuming index.html is in the same folder
    }
}

module.exports = MainWindow;
