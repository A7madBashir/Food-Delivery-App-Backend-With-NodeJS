const { Server } = require("socket.io");
const winston = require("winston");
module.exports = function (app) {
  const io = new Server(app);
  io.on("connection", function (socket) {
    winston.info("Socket.io section begin")
    console.log(`User Connected ...>>>>>${socket.id}<<<<<<...`);
    //Send BroadCast Message to get delivery man in flutter the delivery who is on will get the message
    //so in this case will activiate function that take last order added to database
    //This order will send to order-room event to join the room
    socket.on("get-delivery", (data) => {
      console.log("order room :", data);
      socket.broadcast.emit("receive", data);
    });

    //Get Restaurant Id From Customer App This Id Should Send To DataBase To Get Long&Lati
    //This Data Will Compare It With All Online Deliveries And Get nearest one to Restaurant
    socket.on("resturant-id", async (data) => {
      // console.log("Restaurant Id:" + data.resturantid + "Room id:" + data.room);
      getLongLati4Resturant(data.resturantid).then(async (result) => {
        // console.log(result);
        // {
        //  geo_location_latitude: '33.502031',
        //  geo_location_longitude: '36.292023'
        // }
        socket.to(`${data.room}`).emit("recieveRest", result);
      });
    });

    async function getLongLati4Resturant(restid) {
      const result = await sql.query(
        `select geo_location_latitude,geo_location_longitude from resturant where rest_id=${restid}`
      );
      return result.recordsets[0][0];
    }

    //this event will send from customer first then get this from Delivery
    //After send data to the database it's should get the last order that added
    //so here we can join room that customer joined by order id from get-delivery event
    socket.on("order-room", async (room) => {
      //    The Problem is Cannot Get Room Size Or ClientsCount :(   //
      const count = io.in(`${room}`).clients.length;
      console.log("order room and members count:", room, "\t", count);
      if (count < 2) {
        socket.join(`${room}`);
        socket.emit("canOrder", true);
        console.log(
          "Joining Delivery The Room With customer:",
          io.in(`${room}`).clients.length
        );
      } else {
        socket.emit("canOrder", false);
        console.log("Can't Join Because it's full");
      }
    });
    //this come and go from customer to delivery and resturant
    socket.on("location", (data) => {
      // console.log("Location Data:",data);
      console.log(data.name, data.room, data.latitude, data.longitude);
      socket.to(`${data.room}`).emit("get-location", {
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });
    socket.on("leave-room", (room) => {
      console.log("Leaving Room" + room);
      socket.leave(`${room}`);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnect...");
      socket.disconnect();
    });
    // socket.on('error', function (err) {
    //   console.log('received error from client:', client.id)
    //   console.log(err)
    // })
  });
};
