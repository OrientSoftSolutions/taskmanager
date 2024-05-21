const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createPool({
    // connectionLimit: 10,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });


// Handle connection errors
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database.');

  }
});

module.exports = db;