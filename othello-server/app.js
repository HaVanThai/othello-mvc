var app = require('http').createServer(handler)
var io = require('socket.io')(app);

app.listen(8080);

function handler (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello World!');
}

io.on('connection', function (socket) {
  // Random room number when for new connection
  let rand = Math.floor(Math.random()*10000);
  let room = ("0000" + rand).slice(-4);

  // Add client to room
  socket.join(room);

  // TODO
  socket.emit('init_room', room);

  // Listen client want to join a friend's room
  socket.on('join_room', function(friend_room) {
    if (io.sockets.adapter.rooms[friend_room] && io.sockets.adapter.rooms[friend_room].length > 0) {
      
      socket.join(friend_room);

      // socket.emit() doesn't work at first time so I use io.to(socket.id).emit() instead
      io.to(socket.id).emit('joined_room', friend_room);

      // TODO it doesn't work
      socket.broadcast.in(room).emit('opponent_joined', "Opponent's Name");
      room = friend_room;
    } else {
      socket.emit('joined_room', '-1');
    }
  });

  // Listen if a player play a new move
  socket.in(room).on('on_move', function(data) {
    // Emit to the opponent
    socket.broadcast.in(room).emit('new_move', data);
  });
});