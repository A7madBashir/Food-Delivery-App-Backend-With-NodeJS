const { config } = require("../startup/connect");
var passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const exctractJwt = require("passport-jwt").ExtractJwt;
const sql = require("mssql");
const configuration=require('config');
const winston = require("winston");

const publicKey=configuration.get("jwtPublicKey")
const options = {
  jwtFromRequest: exctractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: publicKey,
  algorithms: ["RS256"],
};
var id = 0;
module.exports = function (isCustomer) {
  const strategy = new jwtStrategy(options, (payload, done) => {
    winston.info("The Payload Id of User Is Here => " + payload.sub);
    id = payload.sub;
    if (isCustomer) {
      CheckCus4JWT(id)
        .then(function (result) {
          if (result) return done(null, result);
          else return done(null, false);
        })
        .catch((err) => {
          winston.error("From JWT Function" + err);
          return done(err, null);
        });
    } else {
      getDel4JWT(id)
        .then((result) => {
          if (result) return done(null, result);
          else return done(null, false);
        })
        .catch((err) => {
          winston.error("From JWT Function" + err);
          done(err, false);
        });
    }
  });
  passport.use("jwt", strategy);

  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: () => {
      return passport.authenticate("jwt", { session: false });
    },
  };
};

async function CheckCus4JWT(id) {
  let pool = await sql.connect(config);
  let product = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM CUSTOMER WHERE cus_id=@id");
  //product.recordsets[0][0];
  return product.recordsets[0][0];
}

async function getDel4JWT(id) {
  let pool = await sql.connect(config);
  let product = await pool
    .request()
    .input("del_id", sql.Int, id)
    .query("Select * from deliveryboy where del_id =@del_id");
  return product.recordsets[0][0];
}
