const express = require("express");
const app = express();
const sql = require("mssql");
app.use(express.json());
var session = require("express-session");
const { json } = require("body-parser");
var port = process.env.port;
//connect to DB
const config = {
  user: "DB_A6F580_FoodDelivery01_admin",
  password: "123456789FD",
  server: "SQL5102.site4now.net",
  database: "DB_A6F580_FoodDelivery01",
  options: {
    enableArithAbort: true,
  },
};

sql.connect(config, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("connection succ");
});
app.use(
  session({
    secret: "Secret",
    resave: true,
    saveUninitalized: true,
  })
);
app.get("/", (req, res) => {
  res.send("It's All Good!");
});
app.get("/order", (req, res) => {
  //read from DB
  res.json([[]]);
});



//        GET THE DATA FROM USER TABLE IN THE DATABASE
app.get("/User", async (req, res) => {
  const result = await sql.query`selct * from [User]`;
  res.status(200).json([...result.recordset]);
});

//        GET THE DATA FROM MEAL TABLE IN THE DATABASE
app.get("/Meal", async (req, res) => {
  const result = await sql.query`select * from meal`;
  //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
  res.status(200).json([...result.recordset]);
});

//        GET THE DATA FROM CUSTOMER TABLE IN THE DATABASE
app.get("/Customer", async (req, res) => {
  const result = await sql.query`select * from customer`;
  //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
  res.status(200).json([...result.recordset]);
});


//Check Customer Login

app.post("/Customer/Login", (req, res) => {
  let Login = {...req.body};    
  Checkcus(Login).then((result) => {
    if(result.length===1 && result[0][0]!=null){
    res.status(201).json(result[0][0]);
    }
    else {
      res.send(null);
    }
  });
});

async function Checkcus(Login) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("input_name", sql.NVarChar, Login.username)
      .input("input_pass", sql.NVarChar, Login.password)
      .query(
        "Select * from customer where username =@input_name and [password] =@input_pass "
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}
//////////////////

//    Add customer To The DATABASE

app.post("/Customer/Signup", (req, res) => {
  let Signup = { ...req.body};

  addCustomer(Signup).then((result) => {
    res.status(201).json(result);
    //res.send("Data Send!");
  });
});

async function addCustomer(customer) {
  try {
    let pool = await sql.connect(config);
    let insertProduct = await pool
      .request()
      .input("username", sql.NVarChar, customer.username)
      .input("phone", sql.NVarChar, customer.phone)
      .input("email", sql.NVarChar, customer.Email)
      .input("password", sql.NVarChar, customer.password)
      .execute("AddCustomer");
    return insertProduct.recordsets;
  } catch (err) {
    console.log(err);
  }
}

//Search Meal By Name In the DataBase

app.get("/Meal/SearchMeal/:name", (req, res) => {
  searchmeal(req.params.name)
    .then((result) => {
      res.json(result[any]);
    })
    .catch((err) => {});
});
async function searchmeal(name) {
  try {
    let pool = await sql.connect(config);
    let insertProduct = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .execute("Searchmeal");
    return insertProduct.recordsets;
  } catch (err) {
    console.log(err);
  }
}

/////////////////

//To Add MEAL To DataBase

app.post("/Meal/AddMeal", (req, res) => {
  let Meal = { ...req.body };

  addmeal(Meal).then((result) => {
    res.status(201).json(result);
    res.send("Data Send!");
  });
});

async function addmeal(meal) {
  try {
    let pool = await sql.connect(config);
    let insertmeal = await pool
      .request()
      .input("me_name", sql.NVarChar, meal.me_name)
      .input("image", sql.NVarChar, meal.image)
      .input("price", sql.Int, meal.price)
      .input("description", sql.NVarChar, meal.description)
      .execute("AddMeal");
    return insertmeal.recordsets;
  } catch (err) {
    console.log(err);
  }
}
//////////////////

app.get("/home", (req, res) => {
  res.send("Welcome to my home page Mr." + username);
});

app.listen(process.env.PORT || 5000, function () {
  console.log("the server started");
});
