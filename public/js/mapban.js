var socket = io();
console.log("Laoded!");
var lockedFlag;

socket.on('connect', function(){
  console.log("Connected!");
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err){
    if(err){
      alert(err);
      window.location.href = "/";
    } else{
      console.log("No errors.")
    }
  });
});

// socket.on('newMapBan', function(ban){
//   console.log(ban);
//   var map = $(`#${ban.map}`);
//   map.css('background-color', '#FF1E40');
//   console.log(map)
// });

socket.on('getUserName', function(userName){
  $('#username').html(userName);
});

socket.on('getRoomGameStyle', function(gameStyle){
  $('#game-style').html(`Best of ${gameStyle}`)
});


socket.on('updateRoom', function(roomData){
  //console.log(roomData.roomData)
  lockedFlag = roomData.lockedFlag;
  console.log(`VETOFINISHED: ${roomData.vetoFinished}`);
  var mapsContainer = $('#maps');
  mapsContainer.html("");
  roomData.roomData.forEach(function(map){
    mapsContainer.append(map);
    console.log("DONE")
  })

  var mapBox = $('.map');

  mapBox.on('click', function(){
    if(!roomData.vetoFinished){
      if(lockedFlag){

      } else {
        $(this).css('background-color', '#FF1E40');
        var mapid = $(this).attr('mapid');
        console.log(mapid);
        lockedFlag = true;
        $('.map').css('cursor', 'default')
        $('.overlay').css('opacity', 0.30)
        var newRoomData = $('.map');
        console.log(newRoomData.length);

        var parsedNewRoomData = [];

        for(var i=0; i<newRoomData.length; i++){
          parsedNewRoomData[i] = newRoomData[i].outerHTML;
        }

        console.log("EMISJA")

          socket.emit('newRoomDataPackage', parsedNewRoomData);
          socket.emit('updateBanList', mapid);
          socket.emit('unlockBan');
      }
    }
  });

});

socket.on('unlockBanUpdate', function(lockedFlagUpdate){
  lockedFlag = lockedFlagUpdate;
  $('.map').css('cursor', 'pointer')
  $('.overlay').css('opacity', 0)
});

socket.on('mapsChosen', function(lastMaps){

  var chosenMaps = $('#chosen-maps');
  lastMaps.forEach(function(map){
    chosenMaps.append($('<li></li>').text(map.name));
  });

  $('.map').css('cursor', 'default')
  $('.overlay').css('opacity', 0)
  console.log("VETO END!")

  socket.emit('vetoFinished', true);
})




socket.on('disconnect', function(){
  console.log('Disconnected from the server')
});
