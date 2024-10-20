const { ipcMain } = require('electron');

class IPCHandlers {
    constructor(expenseManager) {
        this.expenseManager = expenseManager;
        this.registerHandlers();
    }

    registerHandlers() {
        ipcMain.handle('add-expense', async (event, name, price) => {
            const expense = await this.expenseManager.addExpense(name, price);
            return expense;
        });

        ipcMain.handle('delete-expense', async (event, id) => {
            const changes = await this.expenseManager.deleteExpense(id);
            return changes;
        });

        ipcMain.handle('get-expenses', async () => {
            const expenses = await this.expenseManager.getExpenses();
            return expenses;
        });
    }
}

module.exports = IPCHandlers;
