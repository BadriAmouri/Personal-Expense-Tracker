const mysql = require('mysql2/promise'); // Import mysql2 with promise support

const config = {
    host: 'localhost',              // MySQL server host
    user: 'root',                   // MySQL username (default is 'root')
    password: 'your_password',     // Your MySQL root password

    database: 'expenses'            // Name of the database to connect to
};

class MySQLDatabase {
    constructor() {
        this.connection = null; // Initialize connection
    }

    // Connect to the database
 // Connect to the database
async connect() {
    try {
        const connection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
        });
        
        // Check and create the database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
        await connection.end();

        // Connect to the newly created or existing database
        this.connection = await mysql.createConnection(config);
        console.log('Connected to MySQL database.');
        await this.createTable();
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
        throw error;
    }
}


   
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price REAL NOT NULL
            )
        `;
        await this.connection.query(sql);
        console.log("Expenses table created or already exists in MySQL.");
    }

  
    async addExpense(name, price) {
        if (isNaN(price)) {
            throw new Error('Price must be a number');
        }
        const sql = 'INSERT INTO expenses (name, price) VALUES (?, ?)';
        const [result] = await this.connection.execute(sql, [name, parseFloat(price)]);
        console.log(`Added expense: ${name}, Price: ${price}`);
        return { id: result.insertId, name, price: parseFloat(price) };
    }

   
    async getExpenses() {
        const sql = 'SELECT * FROM expenses';
        const [rows] = await this.connection.execute(sql);
        console.log("Fetched expenses:", rows);  // Log fetched expenses
        return rows;
    }
    
    // Delete an expense
    async deleteExpense(id) {
        const sql = 'DELETE FROM expenses WHERE id = ?';
        const [result] = await this.connection.execute(sql, [id]);
        return result.affectedRows;
    }

    // Disconnect from the database
    async disconnect() {
        if (this.connection) {
            await this.connection.end();
            console.log('Disconnected from MySQL database.');
            this.connection = null; // Reset connection to allow for a new connection in the future
        }
    }
}

module.exports = MySQLDatabase;
