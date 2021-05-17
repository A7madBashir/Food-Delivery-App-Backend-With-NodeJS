const express = require("express");
const app = express();
const sql = require("mssql");
var passport = require('passport');
const issueJwt = require("./module/passportJWT/password_utils").issueJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const exctractJwt = require("passport-jwt").ExtractJwt;
const genPassword = require("./module/passportJWT/password_utils").genPassword;
const validatePassword = require("./module/passportJWT/password_utils").valdatepass;
const path = require("path");
const fs=require("fs");
const  json = require("body-parser");
const router=express.Router();
const connect=require('./module/connect');
const mobile=require('./module/mobile');
const customer=require('./module/Customers/customeroperations');
//We Can use moment lib to change time or date format
app.use(express.json());
app.use(passport.initialize());
app.use("/api/mobile",mobile);
app.use("/Customers",customer);

app.get("/", (req, res) => {  

  res.send("It's All Good!");   
});

////////////////////////////////////////

// app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res,done) {
//   res.status(200).json({success:true,msg:'You Are Authorized!'});
// });
// //getting the path to the public key to be able to verify the jwt token body
// const pathToKey = path.join("./module/passportJWT/id_rsa_pub.pem");
// // getting the public key form the previosly declared path
// const publicKey = fs.readFileSync(pathToKey, "utf-8");
// //options for JWT token verifier those are the basic options and there is more
// const options = {
//   /* where to get the token from in the request in this case it should be :
//   headers:{
//     Authrzation: Bearer <token>
//   }
//   */
//   jwtFromRequest: exctractJwt.fromAuthHeaderAsBearerToken(),
//   // specifing the key to decrypt the hash with
//   secretOrKey: publicKey,
//   // specifing the algorithim to hash the body so we can comapre it to the token body to verify the jwt token
//   algorithms: ["RS256"],
// };

// passport.use(
//   new jwtStrategy(options,(payload,done)=>{
//     console.log("The Payload Id of User Is Here => "+ payload.sub);
//     getCus4JWT(payload.sub).then(result => {      
//       if (result)
//         return done(null, result);
//       else
//         return done(null, false);
//     }).catch(err => done(err,null));
//   })
// );
// async function getCus4JWT(id){
//   let pool = await sql.connect(config);
//   let product = await pool
//       .request()
//       .input("cus_id", sql.Int, id)
//       .query(
//         "Select * from Customers where cus_id =@cus_id"
//       );
//     //product.recordsets[0][0];
//     return product.recordsets[0][0];
// };
// app.post("/Login", (req, res,done) => {
//   let Login = req.body;    
  
//   CheckcusTest(Login).then((result) => {  
//     if(!result){
//       res.status(200).json({err:"UnAutherized"});
//       return;
//     }
//     const isValid = validatePassword(result.hash,result.salt, Login.password);
//     if(isValid){
//       const jwt = issueJwt(result);
//       res.status(201).json({
//         success: true,
//         user:result,
//         token: jwt.token,
//         expiresIn: jwt.expires,
//       }); 
//     }else{
//       res.status(401).json({err:"Wrong Password"});
//     }    
//   }).catch(err => res.send(err));
// });

// async function CheckcusTest(Login) {
//   try {
//     let pool = await sql.connect(config);
//     let product = await pool
//       .request()
//       .input("input_name", sql.NVarChar, Login.username)
//       .query(
//         "Select * from Customer where username =@input_name"
//       );
//     return product.recordsets[0][0];
//   } catch (error) {
//     console.log(error);
//   }
// }

// app.post('/register',(req,res,done)=>{
//   let Signup = req.body;    
//   const saltHash = genPassword(Signup.password);  
//   Signup.password=saltHash;      
//   addCustomerTest(Signup).then((result) => {    
//     console.log("CUSTOMER ID MUST BE HERE =>"+result.cus_id);
//     //res.status(201).json(result);
    
//     const jwt = issueJwt(result);
//     res.json({
//       success: true,
//       user:result,
//       token: jwt.token,
//       expiresIn: jwt.expires,
//     });
//     //res.send("Data Send!");
//   });
// });

// async function addCustomerTest(customer) {
//   try {
//     let pool = await sql.connect(config);
//     let insertProduct = await pool
//       .request()
//       .input("username", sql.NVarChar, customer.username)
//       .input("phone", sql.NVarChar, customer.phone)
//       .input("email", sql.NVarChar, customer.email)
//       .input("hash", sql.NVarChar, customer.password.hash)
//       .input("salt", sql.NVarChar, customer.password.salt)
//       .execute("AddCustomers");
//       insertProduct.recordsets;
//       let product = await pool
//       .request()
//       .input("username", sql.NVarChar, customer.username)
//       .query(
//         "Select * from Customer where username =@username"
//       );
//     return product.recordsets[0][0];    
//   } catch (err) {
//     console.log(err);
//   }
// }


///////////////////////////////////////

// passport.serializeUser(function (user, done) {
//   console.log('serializing user:', user.username);
//   done(null, user.username);
// });

// passport.deserializeUser(function (username, done) {
//   done(null,username);
// });

// passport.use('Login', new LocalStrategy({
//   passReqToCallback: true
// },
//   function (req, username, password, done) {
//     let pool = await sql.connect(config);
//     let product = await pool
//       .request()
//       .input("input_name", sql.NVarChar, username)
//       .input("input_pass", sql.NVarChar, password)
//       .query(
//         "Select username,[password] from customer where username =@input_name and [password] =@input_pass "
//       );
//     return product.recordsets;
    
//   }
//   ));

///////////////////////////////////////

//        GET THE DATA FROM USER TABLE IN THE DATABASE
// app.get("/User", async (req, res) => {
//   const result = await sql.query`selct * from Users`;
//   res.status(200).json([...result.recordset]);
// });


//        GET THE DATA FROM CUSTOMER TABLE IN THE DATABASE
// app.get("/Customer", async (req, res) => {
//   const result = await sql.query`select * from customer`;
//   //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
//   res.status(200).json([...result.recordset]);
// });

// //Check Customer Login

// app.post("/Customer/Login", (req, res) => {
//   let Login = {...req.body};    
//   Checkcus(Login).then((result) => {
//     if(result.length===1 && result[0][0]!=null){
//     res.status(201).json(result[0][0]);
//     }
//     else {
//       res.send(null);
//     }
//   });
// });

// async function Checkcus(Login) {
//   try {
//     let pool = await sql.connect(config);
//     let product = await pool
//       .request()
//       .input("input_name", sql.NVarChar, Login.username)
//       .input("input_pass", sql.NVarChar, Login.password)
//       .query(
//         "Select username,[password] from customer where username =@input_name and [password] =@input_pass "
//       );
//     return product.recordsets;
//   } catch (error) {
//     console.log(error);
//   }
// }
// //////////////////

// //    Add customer To The DATABASE

// app.post("/Customer/Signup", (req, res) => {
//   let Signup = { ...req.body};

//   addCustomer(Signup).then((result) => {
//     res.status(201).json(result);
//     //res.send("Data Send!");
//   });
// });

// async function addCustomer(customer) {
//   try {
//     let pool = await sql.connect(config);
//     let insertProduct = await pool
//       .request()
//       .input("username", sql.NVarChar, customer.username)
//       .input("phone", sql.NVarChar, customer.phone)
//       .input("email", sql.NVarChar, customer.Email)
//       .input("password", sql.NVarChar, customer.password)
//       .execute("AddCustomer");
//     return insertProduct.recordsets;
//   } catch (err) {
//     console.log(err);
//   }
// }
/////////////////

//      Update Customer Details 

app.post("/Customer/Update", (req, res) => {
  let Update = { ...req.body};

  UpdateCustomer(Update).then((result) => {
    res.status(201).json(result);
    //res.send("Data Send!");
  });
});

async function UpdateCustomer(customer) {
  try {
    let pool = await sql.connect(config);
    let UpdatreProduct = await pool
      .request()
      .input("id",sql.Int,customer.id)
      .input("username", sql.NVarChar, customer.username)
      .input("phone", sql.NVarChar, customer.phone)
      .input("Email", sql.NVarChar, customer.Email)
      .input("password", sql.NVarChar, customer.password)
      .execute("UpdateCustomer");
    return UpdatreProduct.recordsets;
  } catch (err) {
    console.log(err);
  }
}

/////////////////

//Search Meal By Name In the DataBase

app.get("/Meal/SearchMeal/:name", (req, res) => {
  searchmeal(req.params.name)
    .then((result) => {
      res.json(result);
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
    return insertProduct.recordsets[0];
  } catch (err) {
    console.log(err);
  }
}

/////////////////

// //To Add MEAL To DataBase

// app.post("/Meal/AddMeal", (req, res) => {
//   let Meal = { ...req.body };

//   addmeal(Meal).then((result) => {
//     res.status(201).json(result);
//     res.send("Data Send!");
//   });
// });

// async function addmeal(meal) {
//   try {
//     let pool = await sql.connect(config);
//     let insertmeal = await pool
//       .request()
//       .input("me_name", sql.NVarChar, meal.me_name)
//       .input("image", sql.NVarChar, meal.image)
//       .input("price", sql.Int, meal.price)
//       .input("description", sql.NVarChar, meal.description)
//       .execute("AddMeal");
//     return insertmeal.recordsets;
//   } catch (err) {
//     console.log(err);
//   }
// }
//////////////////

app.get("/home", (req, res) => {
  res.send("Welcome to my home page Mr");
});



app.listen(process.env.PORT||5000, function () {
  console.log("the server started");
});
