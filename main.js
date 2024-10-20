const { app } = require('electron');
const MainWindow = require('./mainWindow');
const ExpenseManager = require('./expenseManager');
const IPCHandlers = require('./ipcHandlers');

let mainWindow;
let expenseManager;

app.whenReady().then(() => {
    try {
        mainWindow = new MainWindow();
        expenseManager = new ExpenseManager();
        new IPCHandlers(expenseManager); // Register IPC handlers

        // Fetch expenses after window loads
        mainWindow.win.webContents.on('did-finish-load', () => {
            expenseManager.getExpenses().then(expenses => {
                mainWindow.win.webContents.send('load-expenses', expenses);  // Send expenses to renderer
            }).catch(err => {
                console.error('Failed to fetch expenses:', err);
            });
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') app.quit();
        });

        // Ensure the database is closed before quitting
        app.on('before-quit', async () => {
            await expenseManager.close();
            console.log('Closed the SQLite database.');
        });

        app.on('activate', () => {
            if (mainWindow.win === null) {
                mainWindow = new MainWindow();
            }
        });
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});
