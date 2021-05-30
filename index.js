const express = require("express");
const app = express();
var passport = require('passport');

// Add Socket-io and pass the PORT of API instead of Http Server  
const io =require('socket.io')(app.listen(process.env.PORT||5000, function () {
console.log("the server started");}));

const mobile=require('./module/mobile');
const customer=require('./module/Customers/customeroperations');
const delivery=require('./module/Deliverys/deliveryoperation');
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

// io.on('connection', function(socket){
//   console.log('NEW USER CONNECTED !');
  
//   //console.log(myroom);
//   //socket.join(myroom);

//   socket.on('disconnect', () => {
//       console.log('USER DISCONNECTED !');
//       socket.leave(myroom);
//   });
//   socket.on('msg', function(data) {
//       console.log("Success______________________. ✔");
//       io.sockets.in(myroom).emit('msg',{message: data.message,room: data.room,name :data.name});	    			    		
//   });
// });

io.on('connection', function (socket) {
  
  console.log('socket connect...', socket.id);  

  // socket.on('typing', function name(data) {
  //   console.log(data);
  //   io.emit('typing', data);
    
  // })

  socket.on('message', function name(data) {
    console.log(data);
    io.emit('message', data);
    socket.join(socket.id);
  })

  // socket.on('location', function name(data) {
  //   console.log(data);
  //   io.emit('location', data);
  // })

  socket.on('connect', function () {
    console.log("USer Connected....>>>>>@<<<<<<...");
  })

  socket.on('disconnect', function () {
    console.log('socket disconnect...', socket.id);
    // handleDisconnect()
  });
  // socket.on('error', function (err) {
  //   console.log('received error from client:', client.id)
  //   console.log(err)
  // })
});


