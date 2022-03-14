const express = require("express");
const router = express.Router();
const authClass = require("../middleware/auth");
const auth = authClass();

router.get("/protected", auth.authenticate(true), (req, res, next) => {
  res.status(201).json({ success: true, msg: "You Are Authorized!" });
});
module.exports = router;
