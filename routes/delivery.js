const express = require("express");
const sql = require("mssql");
const authClass = require("../middleware/auth");
const auth=authClass()
const { AddBill, CheckDelivery } = require("../module/delivery");
const { issueJwt } = require("../module/passportJWT/password_utils");
const Router = express.Router();

//  This File For DeliveryMan Opreations of Login/EditInformation/ with JWT Auth..

//      Root Page Information
Router.get("/", (req, res) => {
  res.send(
    "Welcome To Delivery Man Section Here You will See All Things About Checking , operations of Delivery And Authraise"
  );
});
Router.post("/Login", (req, res) => {
  let Login = req.body;
  CheckDelivery(Login)
    .then((result) => {
      if (result) {
        const jwt = issueJwt(result);
        res.status(200).json({
          success: true,
          user: result,
          token: jwt.token,
          expiresIn: jwt.expires,
        });       
      } else {
        return res
          .status(401)
          .json({ err: "Wrong Name or Password", success: false });
      }
    })
    .catch((err) => res.send(err));
});

//Make Router To Add Bill Record
Router.post("/Bill", auth.authenticate(false), async (req, res) => {
  let Bill = req.body;
  AddBill(Bill).then((result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(401).json({ success: false });
    }
  });
});

//Get Order Information from server
Router.get("/getOrder/:or_id", auth.authenticate(false), async (req, res) => {
  const result = await sql.query(
    `select [order].total_price,customer.phone from customer,[order] where customer.cus_id=[order].cus_id and [order].or_id=${req.params.or_id}`
  );
  res.status(200).json([...result.recordset][0]);
});

// Router.use(passport.initialize());
module.exports = Router;
