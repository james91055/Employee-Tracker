const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: process.env.USER_DB,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected");
});

module.exports = connection;
