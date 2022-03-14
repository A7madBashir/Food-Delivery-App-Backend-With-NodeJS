const express = require("express");
const sql = require("mssql");
const winston = require("winston");
const issueJwt = require("../module/passportJWT/password_utils").issueJwt;
const genPassword = require("../module/passportJWT/password_utils").genPassword;
const validatePassword =
  require("../module/passportJWT/password_utils").valdatepass;
const authClass = require("../middleware/auth");
const auth = authClass();
const router = express.Router();
const {
  Checkcus,
  InsertHave2,
  InsertOrder,
  UpdateCustomer,
  addCustomer,
} = require("../module/customer");

// router.use(auth.initialize());

router.get("/", (req, res) => {
  res.send(
    "Welcome To Customers Section Here You will See All Things About Adding and Checking Customres And Authraise"
  );
});

router.post("/register", (req, res, done) => {
  let Signup = req.body;
  const saltHash = genPassword(Signup.password);
  Signup.password = saltHash;
  addCustomer(Signup).then((result) => {
    winston.info("CUSTOMER ID MUST BE HERE =>" + result.cus_id);
    //res.status(201).json(result);

    const jwt = issueJwt(result);
    res.json({
      success: true,
      user: result,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
    //res.send("Data Send!");
  });
});

router.post("/Login", (req, res, done) => {
  let Login = req.body;
  Checkcus(Login)
    .then((result) => {
      if (!result) {
        res.status(200).json({ err: "Not Register" });
        return;
      }
      const isValid = validatePassword(
        result.hash,
        result.salt,
        Login.password
      );
      if (isValid) {
        const jwt = issueJwt(result);
        res.status(201).json({
          success: true,
          user: result,
          token: jwt.token,
          expiresIn: jwt.expires,
        });
      } else {
        res.status(401).json({ err: "Wrong Password" });
      }
    })
    .catch((err) => res.send(err));
});

router.get("/ShowCustomer/:id", auth.authenticate(true), async (req, res) => {
  const result = await sql.query(
    `select * from customer where cus_id=${req.params.id}`
  );
  res.status(200).json([...result.recordset]);
});

// The Order is just like the food cart when only the customers login and add meal to pay
// And press pay BUTTON should GET an command to insert record with the data from the screen
// To ORDER Table in DataBase So This Route will insert the data that came from the app and get this last order added
// AND SEND IT TO join-room event IN SOCKET FOR CUSTOMER and DELIVERY
//After That we should send data to bill table and show it to customer

router.post("/order", auth.authenticate(true), async (req, res) => {
  let data = { ...req.body };
  InsertOrder(data).then((result) => {
    InsertHave2(result);
    res.status(201).json(result);
    //res.send("Data Send!");
  });
});

router.get("/Bill/:or_id", auth.authenticate(true), async (req, res) => {
  const result = await sql.query(
    `select * from bill where or_id=${req.params.or_id}`
  );
  res.status(200).json([...result.recordset]);
});
router.post("/Edit", auth.authenticate(true), (req, res) => {
  let Update = { ...req.body };
  if (Update.password != "") {
    const saltHash = genPassword(Update.password);
    Update.password = saltHash;
  } else {
    let salt = "";
    let hash = "";
    Update.password = { salt, hash };
  }
  UpdateCustomer(Update).then((result) => {
    res.status(201).json(result);
    //res.send("Data Send!");
  });
});

module.exports = router;
