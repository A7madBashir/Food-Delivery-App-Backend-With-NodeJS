const express = require("express");
const app = express();
// const sql = require("mssql");
var passport = require('passport');
// const issueJwt = require("./module/passportJWT/password_utils").issueJwt;
// const jwtStrategy = require("passport-jwt").Strategy;
// const exctractJwt = require("passport-jwt").ExtractJwt;
// const genPassword = require("./module/passportJWT/password_utils").genPassword;
// const validatePassword = require("./module/passportJWT/password_utils").valdatepass;
// const path = require("path");
// const fs=require("fs");
// const  json = require("body-parser");
// const router=express.Router();
// const connect=require('./module/connect');
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


app.listen(process.env.PORT||5000, function () {
  console.log("the server started");
});
