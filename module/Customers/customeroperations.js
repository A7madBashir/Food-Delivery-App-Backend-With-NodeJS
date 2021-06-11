const express = require("express");
const app=express();
const config=require("../connect").config;
const sql = require("mssql");
var passport = require('passport');
const issueJwt = require("../passportJWT/password_utils").issueJwt;
const jwtStrategy = require("passport-jwt").Strategy
const exctractJwt = require("passport-jwt").ExtractJwt;
const genPassword = require("../passportJWT/password_utils").genPassword;
const validatePassword = require("../passportJWT/password_utils").valdatepass;
const path = require("path");
const fs=require("fs");
const Router=express.Router();

// This File About Customer Login/SignUp/UpdateInformation/Ordering with JWT Auth
customer_id=0;
Router.use(passport.initialize());
Router.use(function(req,res,next){        
    next();
});

Router
    .route('/').get((req,res)=>{
        res.send("Welcome To Customers Section Here You will See All Things About Adding and Checking Customres And Authraise");
    });
//      TESTING FOR CHECK THE CUSTOMER WITH HIS TOKEN
Router 
    .route('/protected')
    .get( passport.authenticate('jwt', { session: false }), (req,res,next) =>{
        res.status(201).json({success:true,msg:'You Are Authorized!'});
    });
    //getting the path to the public key to be able to verify the jwt token body
    const pathToKey = path.normalize('./module/passportJWT/id_rsa_pub.pem');
    // getting the public key form the previosly declared path
    const publicKey = fs.readFileSync(pathToKey, "utf-8");
    //options for JWT token verifier those are the basic options and there is more
 const options = {
        /* where to get the token from in the request in this case it should be :
        headers:{
        Authorization : Bearer <token>
        }
        */
        jwtFromRequest :exctractJwt.fromAuthHeaderAsBearerToken(),        
        // specifing the key to decrypt the hash with
        secretOrKey: publicKey,
        // specifing the algorithim to hash the body so we can comapre it to the token body to verify the jwt token
        algorithms: ["RS256"]
    }     
    // const token = jwt.sign(payload, secretOrKey, { expiresIn  });

    passport.use('jwt',
      new jwtStrategy(options,(payload,done)=>{        
      console.log("The Payload Id of User Is Here => "+ payload.sub);
      customer_id=payload.sub;            
      CheckCus4JWT(customer_id).then(function (result){         
        if (result)
          return done(null, result);
        else
          return done(null, false);
      }).catch(err => {
        console.log("From JWT Function"+err);
        done(err,null);        
      }      
      );
    })
  )
   async function CheckCus4JWT(id){    
    let pool = await sql.connect(config);
    let product = await pool.request()
        .input("id", sql.Int, id)
        .query('SELECT * FROM CUSTOMER WHERE cus_id=@id');
      //product.recordsets[0][0];    
    return product.recordsets[0][0];  
  }
  
Router
  .route('/register').post((req,res,done)=>{
    let Signup = req.body;    
    const saltHash = genPassword(Signup.password);  
    Signup.password=saltHash;      
    addCustomer(Signup).then((result) => {    
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
  
  async function addCustomer(customer) {
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
    Checkcus(Login).then((result) => {  
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
  
  async function Checkcus(Login) {
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
      const result=await sql.query(`select * from customer`);
      res.status(200).json([...result.recordset]);
  });

  // The Order is just like the food cart when only the customers login and add meal to pay 
  // And press pay BUTTON should GET an command to insert record with the data from the screen
  // To ORDER Table in DataBase So This Route will insert the data that came from the app and get this last order added
  // AND SEND IT TO join-room event IN SOCKET FOR CUSTOMER and DELIVERY   
  //After That we should send data to bill table and show it to customer
  
Router
  .route("/order")
  .post(passport.authenticate('jwt',{session:false}),async(req,res)=>{
      let data={...req.body};    
      InsertOrder(data).then((result) => {
        InsertHave2(result)
        res.status(201).json(result);
        //res.send("Data Send!");
      });      
  });

  async function InsertOrder(order){
    try{      
      let pool = await sql.connect(config);
      let insertorder = await pool
        .request()
        .input("price",sql.Int,order.price)
        .input("count",sql.Int,order.count)
        .input("customer",sql.Int,order.customer)
        .execute("AddOrder");
        insertorder.recordsets;
        let product = await pool
        .request()
        .query(
          "Select [order].or_id,meal.m_id from [order],meal where [order].or_id in (select max(or_id) from [order]) and meal.m_id in (select max(m_id) from meal)"
        );
      return product.recordsets[0][0];
    }catch(err){
      console.log(err);
    }
  }
  
  async function InsertHave2(have){
    try{
      let inserthave2= await pool
      .request()
      .input('m_id',sql.Int,have.m_id)
      .input('or_id',sql.Int,have.or_id)
      .execute("AddHave2")
      inserthave2.recordsets;
    }catch(err){
      console.log(err)
    }
  }
// Router
//   .route('/order/have2')
//   .post(passport.authenticate('jwt',{session:false}),async (req,res)=>{
//     let inserthave2= await pool
//     .request()
//     .input('m_id',sql.Int,order.meal_id)
//     .input('or_id',sql.Int,order.order_id)
//     .execute("AddHave2")
//     inserthave2.recordsets;
//   })
Router
.route('/Bill')
.get(passport.authenticate('jwt',{session:false}),async (req,res)=>{
  const result= await sql.query(`select * from bill where bi_id in (select max(bi_id) from bill)`);
  res.status(200).json([...result.recordset]);
})
Router
  .route('/Edit')
  .post(passport.authenticate('jwt',{session:false}),(req, res) => {
    let Update = { ...req.body};  
    const saltHash = genPassword(Update.password);  
    Update.password=saltHash;    
    UpdateCustomer(Update).then((result) => {
      res.status(201).json(result);
      //res.send("Data Send!");
    });
  });
  
  async function UpdateCustomer(customer) {
    try {
      let pool = await sql.connect(config);
      let EditCustomer = await pool
        .request()
        .input("id",sql.Int,customer.id)
        .input("username", sql.NVarChar, customer.username)
        .input("phone", sql.NVarChar, customer.phone)
        .input("Email", sql.NVarChar, customer.Email)
        .input("address", sql.NVarChar, customer.address)
        .input("password", sql.NVarChar, customer.password)
        .execute("UpdateCustomer");
      return EditCustomer.recordsets;
    } catch (err) {
      console.log(err);
    }
  }

  
  module.exports=Router;
  