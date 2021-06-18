const sql=require("mssql");
//connect to DB
const config = {
    user: "db_a763da_fooddelivery03_admin",
    password: "123456789FD",
    server: "SQL5053.site4now.net",
    database: "db_a763da_fooddelivery03",
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