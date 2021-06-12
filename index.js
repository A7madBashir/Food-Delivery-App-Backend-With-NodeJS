const express = require("express");
const app = express();
var passport = require('passport');
const sql = require("mssql");

// Add Socket-io and pass the PORT of API instead of Http Server  
const io =require('socket.io')(app.listen(process.env.PORT||3000, function () {
console.log("the server started");}));

const mobile=require('./module/mobile');
const customer=require('./module/Customers/customeroperations');
const delivery=require('./module/Deliverys/deliveryoperation');
const { json } = require("body-parser");
// const socket=require('./module/Socket-io/socketio');

//We Can use moment lib to change time or date format
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use("/api/mobile",mobile);
app.use("/Customers",customer);
app.use("/Delivery",delivery);
// app.use('/socket',socket);
// The StartUp File For The Backend Of 3Wafi Mobile System

app.get("/", (req, res) => {  
  res.send("<h1>It's All Good!</h1>");     
});

// Using Socket-io for real time connection with database and mobile phone and customers....
io.on('connection', function (socket) {  
  console.log(`User Connected....>>>>>${socket.id}<<<<<<...`);
  
  //Send BroadCast Message to get delivery man in flutter the delivery who is on will get the message
  //so in this case will activiate function that take last order added to database 
  //This order will send to order-room event to join the room
  socket.on('get-delivery',(data)=>{
    console.log(data);
    socket.broadcast.emit('receive',data)
  })

  //emit the message from client 
  //we can add room to the parameter to combine the message with the private room
  //ofcours we can take the id room from the order table in database but thin we should make this id be to delivery and customer
  socket.on('message',(data,room) =>{
    console.log(data);
    // sockets.to(myroom).emit('receive',{message: data.message,room: data.room,name :data.name})        
    socket.to(room).emit('receive',data);    
  });

  //Get Restaurant Id From Customer App This Id Should Send To DataBase To Get Long&Lati
  //This Data Will Compare It With All Online Deliveries And Get nearest one to Restaurant
  socket.on('resturant-id',(restId)=>{
    console.log("Restaurant Id:"+restId);
    var res=getLongLati4Resturant(restId);    
    print(res);
  })

  async function getLongLati4Resturant(restid){
    const result=await sql.query(`select geo_location_latitude,geo_location_longitude from resturant where rest_id=${restid}`);
    return result.recordsets[0];    
  }

  

  //this event will send from customer first
  //After send data to the database it's should get the last order that added
  //so here we can join room that customer joined by order id from get-delivery event
  socket.on('order-room',(room)=>{
    console.log("order room:",room);

    socket.join(room);
  })
  //this come and go from customer to delivery and resturant
   socket.on('location', (data,room) =>{
    console.log(data,room);
    socket.to(room).emit('get-location', data);
  });
  socket.on('leave-room',(room)=>{
    console.log("Leaving Room"+room);
    socket.leave(room);
  })
  
  socket.on('disconnect',()=> {
    console.log('socket disconnect...');
    socket.disconnect();  
  });
  // socket.on('error', function (err) {
  //   console.log('received error from client:', client.id)
  //   console.log(err)
  // })
});


