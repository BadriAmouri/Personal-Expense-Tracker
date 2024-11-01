// SQLiteDatabase.js
const sqlite3 = require('sqlite3').verbose();

class SQLiteDatabase {
    constructor() {
        this.db = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database('expenses.db', (err) => {
                if (err) reject(err);
                console.log('Connected to SQLite database.');
                resolve();
            });
        });
    }
    
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL
            )
        `;
        return new Promise((resolve, reject) => {
            this.db.run(sql, (err) => {
                if (err) reject(err);
                console.log("Expenses table created or already exists in SQLite.");
                resolve();
            });
        });
    }

    async addExpense(name, price) {
        return new Promise((resolve, reject) => {
            const stmt = `INSERT INTO expenses (name, price) VALUES (?, ?)`;
            this.db.run(stmt, [name, price], function (err) {
                if (err) reject(err);
                resolve({ id: this.lastID, name, price });
            });
        });
    }

    async deleteExpense(id) {
        return new Promise((resolve, reject) => {
            const stmt = `DELETE FROM expenses WHERE id = ?`;
            this.db.run(stmt, id, function (err) {
                if (err) reject(err);
                resolve(this.changes);
            });
        });
    }

    async getExpenses() {
        return new Promise((resolve, reject) => {
            const stmt = `SELECT * FROM expenses`;
            this.db.all(stmt, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) reject(err);
                    console.log('Disconnected from SQLite database.');
                    resolve();
                });
            }
        });
    }
}

module.exports = SQLiteDatabase;
