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
  addRoom(roomid, gameStyle){
    var room = {
      roomid,
      gameStyle,
      vetoFinished: false,
      roomData: [
        '<div id="escort" class="map" mapid="1"><span>Escort</span><div class="overlay"></div></div>',
        '<div id="conquest" class="map" mapid="2"><span>Conquest</span><div class="overlay"></div></div>',
        '<div id="demolition" class="map" mapid="3"><span>Demolition (SND/PTB)</span><div class="overlay"></div></div>',
      ],
      bans: [{
        mapid: 1,
        name: 'Escort'
      },{
        mapid: 2,
        name: 'Conquest'
      },{
        mapid: 3,
        name: 'Demolition'
      },],
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
  removeRoomBan(roomid, newBan){
    var room = this.getRoom(roomid);
    if(room){
      this.rooms = this.rooms.filter((room)=>{
        return room.roomid != roomid;
      });
      room.bans = room.bans.filter((map)=>{
        return map.mapid != newBan;
      })
      console.log('ROOMBAN: Updated!', room.bans.length)
      this.rooms.push(room);
    } else {
      console.log('ROOMBAN: Update error!');
    }
    return room;
  }
  updateVetoStatus(roomid, vetoStatus){
    var room = this.getRoom(roomid);
    if(room){
      this.rooms = this.rooms.filter((room)=>{
        return room.roomid != roomid;
      });
      room.vetoFinished = vetoStatus;
      console.log('ROOM VETO: Updated!')
      this.rooms.push(room);
    } else {
      console.log('ROOM VETO: Update error!');
    }
    return room;
  }
  getRawRoomList(){
    return this.rooms;
  }
}

module.exports = {
  Users
}
