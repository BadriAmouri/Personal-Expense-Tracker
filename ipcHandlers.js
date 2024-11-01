// ipcHandlers.js
const { ipcMain } = require('electron');

class IPCHandlers {
    constructor(expenseManager) {
        this.expenseManager = expenseManager;
        this.registerHandlers();
    }

    registerHandlers() {
        ipcMain.handle('load-expenses', async () => {
            try {
                const expenses = await this.expenseManager.getExpenses();
                console.log("Expenses retrieved:", expenses); // Log retrieved expenses
                return expenses; 
            } catch (error) {
                console.error('Error in IPC load-expenses:', error);
                throw error;
            }
        });

        ipcMain.handle('add-expense', async (event, name, price) => {
            return await this.expenseManager.addExpense(name, price);
        });

        ipcMain.handle('delete-expense', async (event, id) => {
            return await this.expenseManager.deleteExpense(id);
        });
    }
}

module.exports = IPCHandlers;
