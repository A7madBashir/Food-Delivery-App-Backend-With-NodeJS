const express = require("express");
const app=express();
const config=require("../connect").config;
const sql = require("mssql");
// var passport = require('passport');
// const issueJwt = require("../passportJWT/password_utils").issueJwt;
// const jwtStrategy = require("passport-jwt").Strategy;
// const exctractJwt = require("passport-jwt").ExtractJwt;
// const genPassword = require("../passportJWT/password_utils").genPassword;
// const validatePassword = require("../passportJWT/password_utils").valdatepass;
// const path = require("path");
// const fs=require("fs");
const Router=express.Router();

//  This File For DeliveryMan Opreations of Login/EditInformation/ with JWT Auth..


module.exports=Router;