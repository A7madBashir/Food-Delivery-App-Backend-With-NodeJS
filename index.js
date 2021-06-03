const express = require("express");
const app = express();
var passport = require('passport');

// Add Socket-io and pass the PORT of API instead of Http Server  
const io =require('socket.io')(app.listen(process.env.PORT||5000, function () {
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
  res.send("It's All Good!");   
});

// Using Socket-io for real time connection with database and mobile phone and customers....
io.on('connection', function (socket) {  
  console.log("User Connected....>>>>>@<<<<<<...");

  var myroom = socket.handshake.query.uid;
  console.log(myroom);
	socket.join(myroom);
  //console.log('socket connect...', socket.id);     
  //emit the message from client 
  //we can add room to the parameter to combine the message with the private room
  //ofcours we can take the id room from the order table in database but thin we should make this id be to delivery and customer
  socket.on('message', function (data) {
    console.log(data);
    //io.emit('message', data);
    // io.sockets.in(myroom).emit('receive',{message: data.message,room: data.room,name :data.name})
    //io.sockets.in(myroom).emit('receive',data.message);
    socket.to(myroom).emit('receive',data.message);
    //socket.join(myroom);
  });

  // socket.on('location', function name(data) {
  //   console.log(data);
  //   io.emit('location', data);
  // });
  
  socket.on('disconnect', ()=> {
    console.log('socket disconnect...', socket.id);
    socket.leave(myroom);
    // handleDisconnect()
  });
  // socket.on('error', function (err) {
  //   console.log('received error from client:', client.id)
  //   console.log(err)
  // })
});


