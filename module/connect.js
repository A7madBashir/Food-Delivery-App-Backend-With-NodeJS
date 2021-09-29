const sql=require("mssql");
//connect to DB
const config = {
    user: "db_a7a6f8_fooddelivery04_admin",
    password: "123456789FD",
    server: "SQL5108.site4now.net",
    database: "db_a7a6f8_fooddelivery04",
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