const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const jsonWebToken = require("jsonwebtoken");
//creates the hash for the pass based on a random salt
const genPassword = (pass) => {
  const salt = crypto.randomBytes(32).toString("hex");
  //pbkdf2Sync(<password>, <salt>, <itrations>, <length>, "<hashing_function>")
  const hash = crypto
    .pbkdf2Sync(pass, salt, 100000, 64, "sha512")
    .toString("hex");
  return {
    salt,
    hash
  };
};
/*
+ takes the provided pass from the requset and the hash and salt form the db
+ genrates a hash based on the enterd pass word with the salt from the db
+ compares the genrated hash with the hash form the db and returns a boolean 
*/
const valdatepass = (ogHash, salt, pass) => {
  const enteredhash = crypto
    .pbkdf2Sync(pass, salt, 100000, 64, "sha512")
    .toString("hex");
  return enteredhash === ogHash;
};
// this function issues a jwt token for the user to store an attachto every request as the autherzation header
const issueJwt = (user) => {  
  //getting the path for the private key
  const pathToPrivKey = path.join('C:\\Users\\A7mad Bashir\\Desktop\\backend\\module\\passportJWT\\id_rsa_priv.pem');
  //getting the private key from the path
  const PrivKey = fs.readFileSync(pathToPrivKey, "utf-8");
  //getting the user id to be able to include it in the token payload
  const _id = user.cus_id;
  // creating the expirey date
  const expiresIn = "1d";
  //creating the payload object 
  const payload = {
    sub: _id,
    iat: Date.now(),
  };
  //signing the token with the pivate key so later when the user send the jwt token we can verify it with the public key
  const signedToken = jsonWebToken.sign(payload, PrivKey, {
    expiresIn,
    algorithm: "RS256",
  });
  //returing the signed token with the expiry date
  return{
    token:`Bearer ${signedToken}`,
    expires:expiresIn
  }
};
module.exports.genPassword = genPassword;
module.exports.valdatepass = valdatepass;
module.exports.issueJwt = issueJwt;