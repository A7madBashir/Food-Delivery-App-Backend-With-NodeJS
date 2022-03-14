const express = require("express");
const router = express.Router();
const sql = require("mssql");
const { searchmeal, searchrest } = require("../module/mobile");

router.route("/Info").get((req, res) => {
  res.send(
    "<h2>Welcome To API Mobile Device</h2> <p>Here You Will Send All Data And Get Data From Mobile App To SQL Server DataBase</p> <p>So All Of Mobile Information Will know Here And Work Here</p>"
  );
});
//        GET THE DATA FROM MEAL TABLE IN THE DATABASE
router.get("/Meal", async (req, res) => {
  const result = await sql.query`select * from meal`;
  //select [me_id],[description],[price],[image],[name] from [DB_A6F580_FoodDelivery01].[dbo].[meal]
  res.status(200).json([...result.recordset]);
});
//Search Meal By Name In the DataBase
router.get("/Meal/SearchMeal/:name", (req, res) => {
  searchmeal(req.params.name)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {});
});

//Search Resturant By Name

router.get("/Meal/SearchResturant/:name", (req, res) => {
  searchrest(req.params.name)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {});
});

//Meal By ID for one screen...
router.get("/Meal/ById/:m_id", async (req, res) => {
  const result = await sql.query(
    `select * from meal where m_id=${req.params.m_id}`
  );
  res.status(200).json([...result.recordset]);
});
//Meals By Resturant ID
router.get("/Resturant/byid/:rest_id", async (req, res) => {
  const result = await sql.query(
    `select * from resturant where rest_id=${req.params.rest_id}`
  );
  res.status(200).json([...result.recordset]);
});
//Get All Resturant
router.get("/Resturant", async (req, res) => {
  const result = await sql.query(`select * from resturant`);
  res.status(200).json([...result.recordset]);
});

//Get Resturant By Meal Id

router.get("/Meal/ByResturantId/:rest_id", async (req, res) => {
  const result = await sql.query(
    `select Distinct meal.m_id,meal.[image],meal.[price],meal.m_count,meal.m_name,meal.[Description] from resturant,meal,have where have.rest_id=${req.params.rest_id} and meal.m_id=have.m_id`
  );
  res.status(200).json([...result.recordset]);
});
//Get Resturant Of MEAL
router.get("/Meal/Resturant/byid/:m_id", async (req, res) => {
  const result = await sql.query(
    `select distinct resturant.address,resturant.rest_name,resturant.phone from resturant,have,meal where have.m_id=${req.params.m_id} and have.rest_id=resturant.rest_id`
  );
  res.status(200).json([...result.recordset]);
});

module.exports = router;
