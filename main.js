const { app } = require('electron');
const MainWindow = require('./mainWindow');
const ExpenseManager = require('./expenseManager');
const IPCHandlers = require('./ipcHandlers');
const SQLiteDatabase = require('./SQLiteDatabase');
const MySQLDatabase = require('./mySQLDatabase');

// Choose the database type based on user input or environment variables
const dbType =  'sqlite' ; // Default to SQLite if not set || 'sqlite'
let db;

app.whenReady().then(async () => {
    try {
        // Initialize the appropriate database
        if (dbType === 'mysql') {
            db = new MySQLDatabase();
        } else if(dbType === 'sqlite') {
            db = new SQLiteDatabase();
        }

        await db.connect(); // Connect to the database at app start
        await db.createTable(); // Create the expenses table

        const expenseManager = new ExpenseManager(db);
        new IPCHandlers(expenseManager);
        const mainWindow = new MainWindow();

        mainWindow.win.webContents.on('did-finish-load', async () => {
            try {
                const expenses = await expenseManager.getExpenses();
                mainWindow.win.webContents.send('load-expenses', expenses); // Send expenses to renderer
            } catch (err) {
                console.error('Failed to fetch expenses:', err);
            }
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') app.quit();
        });

        app.on('before-quit', async () => {
            await expenseManager.close();
            await db.disconnect(); // Ensure database is disconnected on quit
            console.log('Disconnected from the database.');
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
