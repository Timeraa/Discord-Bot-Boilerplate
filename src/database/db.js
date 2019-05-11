//* Import stuff
var mysql = require("mysql2/promise"),
  { success, error } = require("../util/debug"),
  db,
  connection;

//* Connect to database
function connectDatabase() {
  //* If no connection exists -> create one
  if (typeof connection == "undefined") {
    return new Promise(function(resolve, reject) {
      //! localhost -> premid.app if development instance
      db = mysql.createConnection({
        host: process.env.NODE_ENV == "dev" ? process.env.DBHOST : "localhost",
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
        charset: "utf8mb4"
      });

      //* Output info and resolve promise when connected
      db.then(function(conn) {
        connection = conn;
        success("Connected to PreMiD database!");
        resolve(connection);
      });

      db.catch(function(err) {
        error(`Could not connect to database: ${err.message}`);
        process.exit(1);
      });
    });
  } else return connection;
}

//* Export function
module.exports = connectDatabase();
