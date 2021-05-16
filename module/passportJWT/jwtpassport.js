var passport = require('passport');
const issueJwt = require("./password_utils").issueJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const exctractJwt = require("passport-jwt").ExtractJwt;
const genPassword = require("./password_utils").genPassword;
const validatePassword = require("./password_utils").valdatepass;
const path = require("path");
const fs=require("fs");
const app=require("express").express();

app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res,done) {
    res.status(200).json({success:true,msg:'You Are Authorized!'});
  });
  //getting the path to the public key to be able to verify the jwt token body
  const pathToKey = path.join("./id_rsa_pub.pem");
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
  
  passport.use(
    new jwtStrategy(options,(payload,done)=>{
      console.log("The Payload Id of User Is Here => "+ payload.sub);
      getCus4JWT(payload.sub).then(result => {      
        if (result)
          return done(null, result);
        else
          return done(null, false);
      }).catch(err => done(err,null));
    })
  );