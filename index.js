const express = require("express");
const app = express();
const sql = require("mssql");
app.use(express.json());
var session = require("express-session");
var port=process.env.port;
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
app.use(session({
  secret: 'Secret',
  resave: true,
  saveUninitalized: true

}));
app.get("/", (req, res) => {
  res.send("It's All Good!");
});
app.get("/order", (req, res) => {
  //read from DB
  res.json({ name: "rssss" });
});

//        GET THE DATA FROM USER TABLE IN THE DATABASE
app.get("/user", async (req, res) => {
  const result = await sql.query`selct * from [User]`;
  res.status(200).json([...result.recordset]);	
});

//        GET THE DATA FROM MEAL TABLE IN THE DATABASE
app.get("/meal", async (req, res) => {
  const result = await sql.query`select * from meal`;
  //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
  res.status(200).json([...result.recordset]);
	
});

//        GET THE DATA FROM CUSTOMER TABLE IN THE DATABASE
app.get("/checkmember", async (req, res) => {
  const result = await sql.query`select * from customer`;
  //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
  res.status(200).json([...result.recordset]);
	
});

//        SEND THE DATA TO CUSTOMER TABLE IN THE DATABASE
app.post('/auth',(req,res)=>{
  res.send("You Are in Login Page Authraziation");
  var username=req.body.username;
  var password=req.body.password;
  if(username&&password){
    req.query('Select * from customer where username = ? and password = ?', [username, password], function(error, results, fields) {
      if (results.length > 0) {
        request.session.loggedin = true;
        resquest.session.username = username;
        response.redirect('/home');
      } else {
        response.send('Username and/or Password not found');
      }
      response.end();
    });
  }
});
app.get('/home',(req,res)=>{
  res.send("Welcome to my home page Mr."+username);
})

app.listen(process.env.PORT || 5000, function () {
  console.log("the server started");
});
