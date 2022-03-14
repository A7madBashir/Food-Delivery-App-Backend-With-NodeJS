const sql = require("mssql");
const winston = require("winston");

async function addCustomer(customer) {
  try {
    let pool = await sql.connect();
    let insertProduct = await pool
      .request()
      .input("username", sql.NVarChar, customer.username)
      .input("phone", sql.NVarChar, customer.phone)
      .input("address", sql.NVarChar, customer.address)
      .input("email", sql.NVarChar, customer.email)
      .input("hash", sql.NVarChar, customer.password.hash)
      .input("salt", sql.NVarChar, customer.password.salt)
      .execute("AddCustomer");
    insertProduct.recordsets;
    let product = await pool
      .request()
      .input("username", sql.NVarChar, customer.username)
      .input("email", sql.NVarChar, customer.email)
      .query(
        "Select * from Customer where username=@username and email=@email"
      );
    return product.recordsets[0][0];
  } catch (err) {
    winston.error(err);
  }
}

async function Checkcus(Login) {
  try {
    let pool = await sql.connect();
    let product = await pool
      .request()
      .input("input_name", sql.NVarChar, Login.username)
      .query("Select * from Customer where username =@input_name");
    return product.recordsets[0][0];
  } catch (error) {
    winston.error(error);
  }
}

async function InsertOrder(order) {
  try {
    let pool = await sql.connect();
    let insertorder = await pool
      .request()
      .input("price", sql.Int, order.price)
      .input("count", sql.Int, order.count)
      .input("customer", sql.Int, order.customer)
      .execute("AddOrder");
    insertorder.recordsets;
    let product = await pool
      .request()
      .query(
        `Select [order].or_id,meal.m_id,have.rest_id from [order],meal,have where [order].or_id in (select max(or_id) from [order]) and meal.m_id=${order.m_id} and have.m_id=meal.m_id`
      );
    return product.recordsets[0][0];
  } catch (err) {
    winston.error(err);
  }
}

async function InsertHave2(have) {
  try {
    let pool = await sql.connect();
    let inserthave2 = await pool
      .request()
      .input("m_id", sql.Int, have.m_id)
      .input("or_id", sql.Int, have.or_id)
      .execute("AddHave2");
    inserthave2.recordsets;
  } catch (err) {
    winston.error(err);
  }
}

async function UpdateCustomer(customer) {
  try {
    let pool = await sql.connect();
    let EditCustomer = await pool
      .request()
      .input("id", sql.Int, customer.id)
      .input("username", sql.NVarChar, customer.username)
      .input("phone", sql.NVarChar, customer.phone)
      .input("email", sql.NVarChar, customer.email)
      .input("addresss", sql.NVarChar, customer.address)
      .input("hash", sql.NVarChar, customer.password.hash)
      .input("salt", sql.NVarChar, customer.password.salt)
      .execute("UpdateCustomer");
    EditCustomer.recordsets;
    let product = await pool
      .request()
      .input("id", sql.NVarChar, customer.id)
      .query(`Select * from customer where cus_id=@id`);
    return product.recordsets[0][0];
  } catch (err) {
    winston.error(err);
  }
}

module.exports.addCustomer = addCustomer;
module.exports.Checkcus = Checkcus;
module.exports.InsertOrder = InsertOrder;
module.exports.InsertHave2 = InsertHave2;
module.exports.UpdateCustomer = UpdateCustomer;
