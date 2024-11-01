// expenseManager.js
class ExpenseManager {
    constructor(database) {
        this.database = database;
    }

    async addExpense(name, price) {
        return this.database.addExpense(name, price);
    }

    async getExpenses() {
        return this.database.getExpenses();
    }

    async deleteExpense(id) {
        return this.database.deleteExpense(id);
    }

    async close() {
        return this.database.disconnect();
    }
}

module.exports = ExpenseManager;
