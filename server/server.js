const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log('New user connected');


  socket.on('createMapBan', (mapBan)=>{
    io.emit('newMapBan', {
      map: mapBan.map,
      user: mapBan.user,
      time: new Date()
    });
  })

});


io.on('disconnect', (socket)=>{
  console.log('User Disconnected');
});

server.listen(port, ()=>{
  console.log('Server is running on the port', 3000);
});
