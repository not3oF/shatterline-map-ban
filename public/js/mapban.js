var socket = io();
console.log("Laoded!");

socket.on('connect', function(){
  console.log("Connected!");
  var params = jQuery.deparam(window.location.search);
  console.log(params);
  socket.emit('join', params, function(err){
    if(err){
      alert(err);
      window.location.href = "/";
    } else{
      console.log("No errors.")
    }
  });
});

socket.on('newMapBan', function(ban){
  console.log(ban);
  var map = $(`#${ban.map}`);
  map.css('background-color', '#FF1E40');
  console.log(map)
});

var lockedFlag = false;
var mapBox = $('.map');
mapBox.on('click', function(){
  if(lockedFlag){

  } else {
    var map = $(this).attr('id');
    console.log(map);
    socket.emit('createMapBan', {
      map,
      user: 'User',
    });
    lockedFlag = true;
    $('.map').css('cursor', 'default')
    $('.overlay').css('opacity', 0.30)
  }
});

socket.on('downloadData', function(roomData){
  console.log("AKCJA!");
})



socket.on('disconnect', function(){
  console.log('Disconnected from the server')
});
