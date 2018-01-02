class Users{
  constructor (){
    this.users = [];
    this.rooms = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room, lockedFlag: false};
    this.users.push(user);
    return user;
  }
  removeUser (id){
    var user = this.getUser(id);

    if(user){
      this.users = this.users.filter((user)=>{
        return user.id != id;
      })
    }

    return user;
  }
  getUser(id){
    var user = this.users.filter((user) =>{
      return user.id === id;
    });

    return user[0];
  }
  getUserList(room){
    var users = this.users.filter((user) =>{
      return user.room == room;
    });
    var namesArray = users.map((user) =>{
      return user.name;
    })

    return namesArray;
  }
  getRawUserList(){
    return this.users;
  }
  addRoom(roomid){
    var room = {
      roomid,
      roomData: [
        '<div id="mirage" class="map"><span>Mirage</span><div class="overlay"></div></div>',
        '<div id="dust2" class="map"><span>Dust2</span><div class="overlay"></div></div>',
        '<div id="inferno" class="map"><span>inferno</span><div class="overlay"></div></div>',
        '<div id="cache" class="map"><span>Cache</span><div class="overlay"></div></div>',
        '<div id="cobble" class="map"><span>Cobble</span><div class="overlay"></div></div>',
        '<div id="nuke" class="map"><span>Nuke</span><div class="overlay"></div></div>',
        '<div id="train" class="map"><span>Train</span><div class="overlay"></div></div>'
      ],
      roomUsers: []
    }
    this.rooms.push(room);
    return room;
  }
  addRoomUser(roomid, userid){
    var room = this.getRoom(roomid);
    if(room){
      this.rooms = this.rooms.filter((room)=>{
        return room.roomid != roomid;
      })
    }
    var user = this.getUser(userid);
    room.roomUsers.push(user);
    this.rooms.push(room);
  }
  removeRoomUser(roomid, userid){
    var room = this.getRoom(roomid);
    if(room){
      this.rooms = this.rooms.filter((room)=>{
        return room.roomid != roomid;
      });
    }
    var user = this.getUser(userid);
    if(user){
      room.roomUsers = room.roomUsers.filter((user)=>{
        return user.id != userid;
      });
    }
    this.rooms.push(room);
    return room;
  }
  getRoom(roomid){
    var room = this.rooms.filter((room)=>{
      return room.roomid === roomid;
    });

    return room[0];
  }
  removeRoom(roomid){
    var room = this.getRoom(roomid);
    if(room){
      this.rooms = this.rooms.filter((room)=>{
        return room.roomid != roomid;
      });
    }
  }
  updateRoomData(roomid, newData){
    var room = this.getRoom(roomid);
    if(room){
      this.rooms = this.rooms.filter((room)=>{
        return room.roomid != roomid;
      });
      room.roomData = newData;
      console.log('ROOM: Updated!')
      this.rooms.push(room);
    } else {
      console.log('ROOM: Update error!');
    }
    return room.roomData;

  }
  getRawRoomList(){
    return this.rooms;
  }
}

module.exports = {
  Users
}
