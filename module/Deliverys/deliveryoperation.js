const express = require("express");
// const app=express();
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

// Router.use((req,res,next)=>{
//     next();
// });
//     // Root Page Information
Router
    .route('/').get((req,res)=>{
        res.send("Welcome To Delivery Man Section Here You will See All Things About Checking , operations of Delivery And Authraise");
    });
//     //  Checking DeliveryMan Authorized!
// Router 
//     .route('/protected').get( passport.authenticate('jwt', { session: false }), function(req, res,done) {
//         res.status(200).json({success:true,msg:'You Are Authorized!'});
//     });
//     //getting the path to the public key to be able to verify the jwt token body
//     const pathToKey = path.normalize('./module/passportJWT/id_rsa_pub.pem');
//     // getting the public key form the previosly declared path
//     const publicKey = fs.readFileSync(pathToKey, "utf-8");
//     //options for JWT token verifier those are the basic options and there is more
//  const options = {
//         /* where to get the token from in the request in this case it should be :
//         headers:{
//         Authrzation: Bearer <token>
//         }
//         */
//         jwtFromRequest: exctractJwt.fromAuthHeaderAsBearerToken(),
//         // specifing the key to decrypt the hash with
//         secretOrKey: publicKey,
//         // specifing the algorithim to hash the body so we can comapre it to the token body to verify the jwt token
//         algorithms: ["RS256"],
//     };
// //  Router 
//   passport.use(      
//     new jwtStrategy(options,(payload,done)=>{        
//       // console.log("The Payload Id of User Is Here => "+ payload.sub);
//     //   delivery_Id=payload.sub;
//       getDel4JWT(payload.sub).then(result => {      
//         if (result)
//           return done(null, result);
//         else
//           return done(null, false);
//       }).catch(err => done(err,null));
//     })
//   );
//   async function getDel4JWT(id){
//     let pool = await sql.connect(config);
//     let product = await pool
//         .request()
//         .input("del_id", sql.Int, id)
//         .query(
//           "Select * from deliveryboy where del_id =@del_id"
//         );
//       return product.recordsets[0][0];
//   };
// Router
//     .route("/Login").post( (req, res,done) => {
//         let Login = req.body;        
//     CheckDelivery(Login).then((result) => {  
//       if(!result){
//         res.status(200).json({err:"UnAutherized"});
//         return;
//       }
//       const isValid = validatePassword(result.hash,result.salt, Login.password);
//       if(isValid){
//         const jwt = issueJwt(result);
//         res.status(201).json({
//           success: true,
//           user:result,
//           token: jwt.token,
//           expiresIn: jwt.expires,
//         }); 
//       }else{
//         res.status(401).json({err:"Wrong Password"});
//       }    
//     }).catch(err => res.send(err));
//   });
Router
.route("/Login").post(
  (req,res)=>{
    let Login=req.body;
    CheckDelivery(Login).then((result)=>{
      if(result){
        res.status(200).json({
          success:true        
        })
      }else{
        res.status(401).json({
          success:false
        })
      }
    }
    ).catch(err=> res.send(err));
    }
)
  
async function CheckDelivery(Login) {
    try {
      let pool = await sql.connect(config);
      let product = await pool
        .request()
        .input("name", sql.NVarChar, Login.username)
        .input("pass",sql.NVarChar,Login.password)
        .query(
          "Select * from DeliveryBoy where username=@name and [password]=@pass"
        );
      return product.recordsets[0][0];
    } catch (error) {
      console.log(error);
    }
}
//Soulde make Router with post to get Last order from data base



// Router.use(passport.initialize());
module.exports=Router;