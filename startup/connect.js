require("dotenv").config();
const sql = require("mssql");
const winston = require("winston");
//connect to DB
// const config = {
//   user: "",
//   password: "",
//   server: "",
//   database: "",
//   options: {}
// };
const db = JSON.parse(process.env.DB);
sql.connect(db, (err, done) => {
  if (err) {
    winston.info(err);
  }
  winston.info(`Connect to Database`);
});
