const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class ExpenseManager {
    constructor() {
        // Use a file-based SQLite database
        this.db = new sqlite3.Database(path.join(__dirname, 'expenses.db'), (err) => {
            if (err) {
                return console.error('Failed to open the database:', err.message);
            }
            console.log('Connected to SQLite database.');
        });
        this.initDatabase();
    }

    initDatabase() {
        this.db.run(`CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY, name TEXT, price REAL)`);
    }

    addExpense(name, price) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`INSERT INTO expenses (name, price) VALUES (?, ?)`);
            stmt.run(name, price, function (err) {
                if (err) reject(err);
                resolve({ id: this.lastID, name, price });
            });
            stmt.finalize();
        });
    }

    deleteExpense(id) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`DELETE FROM expenses WHERE id = ?`);
            stmt.run(id, function (err) {
                if (err) reject(err);
                resolve(this.changes);
            });
            stmt.finalize();
        });
    }

    getExpenses() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM expenses`, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = ExpenseManager;
