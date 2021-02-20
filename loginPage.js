const express = require("express");
const app = express();
const sql = require("mssql");
app.use(express.json());
var session = require("express-session");
var port=process.env.port;


app.post("/post",(request,response)=>{
    let order = {...request.body}

    addmeal(order).then(result => {
       response.status(201).json(result);
    })

});

async function addmeal(meal) {
    try {
        let pool = await sql.connect(config);
        let insertmeal = await pool.request()            
            .input('name', sql.NVarChar, meal.name)
            .input('image', sql.Int, meal.Quantity)
            .input('price', sql.NVarChar, meal.Message)
            .input('description', sql.NVarChar, meal.City)
            .execute('AddMeal');
        return insertmeal.recordsets;
    }
    catch (err) {
        console.log(err);
    }

}