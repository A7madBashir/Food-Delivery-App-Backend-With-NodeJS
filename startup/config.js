const config = require("config");
require("dotenv").config();
module.exports = function () {
  if (!config.get("jwtPublicKey")) {
    throw new Error("FATAL ERROR: jwtPublicKey is not defined");
}
else if (!process.env.DB) {
    throw new Error("FATAL ERROR: Database connection string is not defined");
  }
};
