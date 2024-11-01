// DatabaseFactory.js
const SQLiteDatabase = require('./SQLiteDatabase'); 
const MySQLDatabase = require('./mySQLDatabase'); 

class DatabaseFactory {
    static createDatabase(type) {
        switch (type.toLowerCase()) {
            case 'mysql':
                console.log("mysql");
                return new  MySQLDatabase(); // Assuming you have a MySQLDatabase class
            case 'sqlite':
          
                return new SQLiteDatabase(); // Default to SQLite
        }
    }
}

module.exports = DatabaseFactory;
