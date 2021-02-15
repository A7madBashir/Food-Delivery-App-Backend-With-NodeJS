const express = require("express");
const app = express();
//const searches = require('./models/searches');
const sql = require("mssql");
const Port=process.env.Port || 80;
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

app.get("/user", async (req, res) => {
  const result = await sql.query`selct * from [User]`;
  res.status(200).json([...result.recordset]);	
});
app.get("/meal", async (req, res) => {
  const result = await sql.query`select * from meal`;
  //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
  res.status(200).json([...result.recordset]);
	
});

app.get("/checkmember", async (req, res) => {
  const result = await sql.query`select * from customer`;
  //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
  res.status(200).json([...result.recordset]);
	
});


app.listen(process.env.PORT || 5000, function () {
  console.log("the server started");
});
