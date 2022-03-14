const winston = require("winston");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`the server started on port ${port}`);
});
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/logging")();
require("./startup/prod")(app);
require("./module/socket.io/socket.io")(server);

app.get("/", (req, res) => {
  res.send("<h1>It's All Good!</h1>");
});

module.exports = server;
