require("dotenv").config();
const mysql = require("mysql2");

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.log("Error connecting to database: ", err);
    } else {
        console.log("Connected to database");
    }
});

module.exports = connection;