const mysql = require("mysql")
const util = require("util")

require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'express_ecom'
  })

db.query = util.promisify(db.query).bind(db);

// connect to the database
db.connect(function(err){
  if (err) {
      console.log("error connecting: " + err.stack);
      return;
  };
  console.log("connected as... " + db.threadId);
});

module.exports = db;