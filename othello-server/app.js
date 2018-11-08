let app = require('http').createServer(handler)
let io = require('socket.io')(app);

app.listen(8080);

// // List of SocketClient objects
// let lstSocketClients = [];

let lstRooms = {};

function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Hello World!');
}

io.on('connection', function (socket) {

  // Init socket
  socket.on('init_socket', function () {
    // Create new client socket
    // Random room number when for new connection
    let rand = Math.floor(Math.random() * 10000);
    let room = ("0000" + rand).slice(-4);
    // Add client to room
    socket.join(room);
    lstRooms[socket.id] = room;

    // Emit to client that you've init a room
    socket.emit('init_room', room);
  });

  // Listen client want to join a friend's room
  socket.on('join_room', function (friend_room) {
    if (io.sockets.adapter.rooms[friend_room]) {
      if (io.sockets.adapter.rooms[friend_room].length == 0) {
        socket.emit('joined_room', '-1');
      } else if (io.sockets.adapter.rooms[friend_room].length == 1) {

        socket.join(friend_room);
        lstRooms[socket.id] = friend_room;
  
        // socket.emit() doesn't work at first time so I use io.to(socket.id).emit() instead
        io.to(socket.id).emit('joined_room', friend_room);
  
        // emit to your friend that you joined
        socket.broadcast.in(friend_room).emit('opponent_joined', "Opponent's Name");
        // room = friend_room;
      } else {
        socket.emit('joined_room', '-2');
      }
    } else {
      socket.emit('joined_room', '-1');
    }
    
  });

  // Listen if a player play a new move
  socket.on('on_move', function (data) {
    // Emit to the opponent
    socket.broadcast.in(lstRooms[socket.id]).emit('new_move', data);
  });

});