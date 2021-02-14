const express = require("express");
const app = express();
const sql = require("mssql");

app.use(express.json());
//connect to DB
const config = {
  user: "DB_A6F580_FoodDelivery01_admin",
  password: "123456789FD",
  server: "SQL5102.site4now.net",
  database: "DB_A6F580_FoodDelivery01",
options: {
    "enableArithAbort": true,
    },  
};

sql.connect(config, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("connection succ");
});

app.get('/meals',(req,res)=>{
  res.send("TRY CONNECT TO MASTER HEROKU");
})

app.get("/meal", async (req, res) => {
  const result = await sql.query`select * from meal`;
  //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
  res.status(200).json([...result.recordset]);
	
});

app.listen(3000, function () {
  console.log("the server started");
});
