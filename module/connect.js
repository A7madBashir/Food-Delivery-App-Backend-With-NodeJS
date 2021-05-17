const sql=require("mssql");
//connect to DB
const config = {
    user: "db_a72f14_fooddelivery02_admin",
    password: "123456789FD",
    server: "SQL5104.site4now.net",
    database: "db_a72f14_fooddelivery02",
    options: {  
      enableArithAbort: true,
    },
  };
  sql.connect(config, (err,done) => {
    if (err) {
      console.log(err);
    }
    console.log("connection success");
  });
  
  module.exports=config;
  module.exports='./connect.js';