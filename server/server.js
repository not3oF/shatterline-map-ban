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

    if(params.roomid==""){
      return callback("RoomId is required!");
    }

    if(!users.getRoom(params.roomid)){
      users.addRoom(params.roomid);
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
    var user = users.getUser(socket.id);
    ///////////////TEST////////////////
    console.log(users.getRawUserList());
    console.log(users.getRawRoomList());
    ///////////////////////////////////

    io.to(params.roomid).emit('updateRoom',
      {
        roomData : room.roomData,
        lockedFlag: user.lockedFlag
      }
    );

    socket.emit('getUserName', user.name);
  });

  socket.on('newRoomDataPackage', (roomData)=>{
  //  console.log(roomData);
    var user = users.getUser(socket.id);
    users.updateRoomData(user.room, roomData);

    io.to(user.room).emit('updateRoom',
    {
      roomData,
      lockedFlag: !user.lockedFlag
    });
  });

  socket.on('updateBanList', (mapid)=>{
    var user = users.getUser(socket.id);
    var bans = users.removeRoomBan(user.room, mapid);
    console.log(bans.length);
    if (bans.length==1){
      var lastMap = bans[0];
      io.to(user.room).emit('mapsChosen', lastMap);
    }
  })

  socket.on('unlockBan', ()=>{
    var user = users.getUser(socket.id);
    var lockedFlag = false;
    socket.broadcast.to(user.room).emit('unlockBanUpdate', lockedFlag);
  });

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
