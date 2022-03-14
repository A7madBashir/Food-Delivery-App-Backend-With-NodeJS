const winston = require("winston");
require("express-async-errors"); // return me express hanlder with err argument extra this argument set in the first then comes the rest of express middleware res,req,next but as i say this function will enable app.use() that has function with 4 arg and this what we defined in error file

module.exports = function () {
  winston.addColors({ foobar: "bold red cyanBG" });
  winston.exceptions.handle(
    new winston.transports.Console({}),
    new winston.transports.File({ filename: "uncaughtException.log" })
  );
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
    })
  );  
};
