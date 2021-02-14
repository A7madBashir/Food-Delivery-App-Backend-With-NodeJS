const express = require("express");
const app = express();
const sql = require("mssql");
const _Port=process.env.Port || 80;
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

app.get("/", (req, res) => {
  res.send("It's All Good!");
});
app.get("/order", (req, res) => {
  //read from DB
  res.json({ name: "rssss" });
});

app.get("/dish", async (req, res) => {
  const result = await sql.query`SELECT TOP (1000) [id]
      ,[UserName]
  FROM [DB_A6F580_FoodDelivery01].[dbo].[Users]`;
  res.status(200).json([...result.recordset]);
	
});

app.listen(_Port, function () {
  console.log("the server started");
});
