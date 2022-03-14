const sql = require("mssql");
const winston = require("winston");

async function CheckDelivery(Login) {
  try {
    let pool = await sql.connect();
    let product = await pool
      .request()
      .input("name", sql.NVarChar, Login.username)
      .input("pass", sql.NVarChar, Login.password)
      .query(
        "Select * from DeliveryBoy where username=@name and [password]=@pass"
      );
    return product.recordsets[0][0];
  } catch (error) {
    winston.error(error);
  }
}

async function AddBill(bill) {
  try {
    let pool = await sql.connect();
    let product = await pool
      .request()
      .input("price", sql.Int, bill.price)
      .input("date", sql.NVarChar, bill.date)
      .input("del_id", sql.Int, bill.del_id)
      .input("or_id", sql.Int, bill.or_id)
      .execute("AddBill");
    return product.recordsets;
  } catch (error) {
    winston.error(error);
  }
}
module.exports.AddBill = AddBill;
module.exports.CheckDelivery = CheckDelivery;
