const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const {Users} = require('./utils/userStorage');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log('New user connected');

  socket.on('join', (params, callback)=>{
    console.log(params.roomid)
    if(params.roomid==""){
      return callback("RoomId is required!");
    }
    if(!users.getRoom(params.roomid)){
      users.addRoom(params.roomid);
      console.log("New room added")
    }
    socket.join(params.roomid);
    var userName = `User${users.getUserList(params.roomid).length+1}`;
    users.removeUser(socket.id);
    users.removeRoomUser(params.roomid, socket.id);
    var room = users.getRoom(params.roomid);
    if(room.roomUsers.length>=2){
      return callback("Max room users!")
    }
    users.addUser(socket.id, userName, params.roomid);
    users.addRoomUser(params.roomid,socket.id);
    console.log(users.getRawUserList());
    console.log(users.getRawRoomList());
    io.to(params.roomid).emit('downloadData', room.roomData);
  });

  socket.on('createMapBan', (mapBan)=>{
    io.emit('newMapBan', {
      map: mapBan.map,
      user: mapBan.user,
      time: new Date()
    });
  })

  socket.on('disconnect', ()=>{
    console.log('User Disconnected');
    var user = users.getUser(socket.id);
    if(user){
      var userRoom = users.removeRoomUser(user.room, user.id);
      users.removeUser(socket.id);
      if(userRoom.roomUsers.length == 0){
        users.removeRoom(userRoom.roomid);
      }
    }

  });

});


server.listen(port, ()=>{
  console.log('Server is running on the port', 3000);
});
