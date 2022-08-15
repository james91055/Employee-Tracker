const mysql = require("mysql2");
require('dotenv').config()


const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER_DB,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;