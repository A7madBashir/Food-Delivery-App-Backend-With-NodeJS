const express=require("express");
const Router=express.Router();

Router.use(function(req,res,next){    
    next();
})
Router
    .route("/Info")
    .get((req,res)=>{
    res.send("<h2>Welcome To API Mobile Device</h2> <p>Here You Will Send All Data And Get Data From Mobile App To SQL Server DataBase</p> <p>So All Of Mobile Information Will know Here And Work Here</p>");   
})

module.exports=Router;