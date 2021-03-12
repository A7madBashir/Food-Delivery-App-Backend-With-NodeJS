const sql=require("mssql");
//connect to DB
const config = {
    user: "DB_A6F580_FoodDelivery01_admin",
    password: "123456789FD",
    server: "sql5063.site4now.net",
    database: "DB_A6F580_FoodDelivery01",
    options: {  
      enableArithAbort: true,
    },
  };
  sql.connect(config, (err,done) => {
    if (err) {
      console.log(err);
    }
    console.log("connection succ");
  });
  

  module.exports='./connect.js';