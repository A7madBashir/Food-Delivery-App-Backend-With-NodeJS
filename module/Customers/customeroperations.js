const express = require("express");
const app=express();
const config=require("../connect").config;
const sql = require("mssql");
var passport = require('passport');
const issueJwt = require("../passportJWT/password_utils").issueJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const exctractJwt = require("passport-jwt").ExtractJwt;
const genPassword = require("../passportJWT/password_utils").genPassword;
const validatePassword = require("../passportJWT/password_utils").valdatepass;
const path = require("path");
const fs=require("fs");
const Router=express.Router();

// This File About Customer Login/SignUp/UpdateInformation/Ordering with JWT Auth
customer_id=null;

Router.use(function(req,res,next){        
    next();
});

Router
    .route('/').get((req,res)=>{
        res.send("Welcome To Customer Section Here You will See All Things About Adding and Checking Customres And Authraise");
    })
//      TESTING FOR CHECK THE CUSTOMER WITH HIS TOKEN
Router 
    .route('/protected').get( passport.authenticate('jwt', { session: false }), function(req, res,done) {
        res.status(200).json({success:true,msg:'You Are Authorized!'});
    });
    //getting the path to the public key to be able to verify the jwt token body
    const pathToKey = path.normalize('./module/passportJWT/id_rsa_pub.pem');
    // getting the public key form the previosly declared path
    const publicKey = fs.readFileSync(pathToKey, "utf-8");
    //options for JWT token verifier those are the basic options and there is more
 const options = {
        /* where to get the token from in the request in this case it should be :
        headers:{
        Authrzation: Bearer <token>
        }
        */
        jwtFromRequest: exctractJwt.fromAuthHeaderAsBearerToken(),
        // specifing the key to decrypt the hash with
        secretOrKey: publicKey,
        // specifing the algorithim to hash the body so we can comapre it to the token body to verify the jwt token
        algorithms: ["RS256"],
    };
//Router    
  passport.use(      
    new jwtStrategy(options,(payload,done)=>{        
      console.log("The Payload Id of User Is Here => "+ payload.sub);
      customer_id=payload.sub;
      getCus4JWT(payload.sub).then(result => {      
        if (result)
          return done(null, result);
        else
          return done(null, false);
      }).catch(err => done(err,null));
    })
  );
  async function getCus4JWT(id){
    let pool = await sql.connect(config);
    let product = await pool
        .request()
        .input("cus_id", sql.Int, id)
        .query(
          "Select * from Customer where cus_id =@cus_id"
        );
      //product.recordsets[0][0];
      return product.recordsets[0][0];
  };
Router
.route('/register').post((req,res,done)=>{
    let Signup = req.body;    
    const saltHash = genPassword(Signup.password);  
    Signup.password=saltHash;      
    addCustomerTest(Signup).then((result) => {    
      console.log("CUSTOMER ID MUST BE HERE =>"+result.cus_id);
      //res.status(201).json(result);
      
      const jwt = issueJwt(result);
      res.json({
        success: true,
        user:result,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
      //res.send("Data Send!");
    });
  });
  
  async function addCustomerTest(customer) {
    try {
      let pool = await sql.connect(config);
      let insertProduct = await pool
        .request()
        .input("username", sql.NVarChar, customer.username)
        .input("phone", sql.NVarChar, customer.phone)
        .input("address",sql.NVarChar,customer.address)
        .input("email", sql.NVarChar, customer.email)
        .input("hash", sql.NVarChar, customer.password.hash)
        .input("salt", sql.NVarChar, customer.password.salt)
        .execute("AddCustomer");
        insertProduct.recordsets;
        let product = await pool
        .request()
        .input("username", sql.NVarChar, customer.username)
        .query(
          "Select * from Customer where username =@username"
        );
      return product.recordsets[0][0];    
    } catch (err) {
      console.log(err);
    }
  };
Router
  .route("/Login").post( (req, res,done) => {
    let Login = req.body;        
    CheckcusTest(Login).then((result) => {  
      if(!result){
        res.status(200).json({err:"UnAutherized"});
        return;
      }
      const isValid = validatePassword(result.hash,result.salt, Login.password);
      if(isValid){
        const jwt = issueJwt(result);
        res.status(201).json({
          success: true,
          user:result,
          token: jwt.token,
          expiresIn: jwt.expires,
        }); 
      }else{
        res.status(401).json({err:"Wrong Password"});
      }    
    }).catch(err => res.send(err));
  });
  
  async function CheckcusTest(Login) {
    try {
      let pool = await sql.connect(config);
      let product = await pool
        .request()
        .input("input_name", sql.NVarChar, Login.username)
        .query(
          "Select * from Customer where username =@input_name"
        );
      return product.recordsets[0][0];
    } catch (error) {
      console.log(error);
    }
  }
Router
  .route("/ShowCustomer")
  .get(passport.authenticate('jwt', { session: false }),async(req,res)=>{
      const result=await sql.query("select * from Customer");
      res.status(200).json([...result.recordset]);
  });
  //
Router
  .route("/order")
  .get(passport.authenticate('jwt',{session:false}),async(req,res)=>{
      const result=await sql.query(`select * from [order] where cus_id=${customer_id}`);
      res.status(200).json([...result.recordset]);
  });

Router
  .route('/Edit')
  .post(passport.authenticate('jwt',{session:false}),(req, res) => {
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

  app.use(passport.initialize());
  module.exports=Router;
  