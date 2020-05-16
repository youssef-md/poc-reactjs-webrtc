const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

const users = {};

io.on('connection', (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }

  socket.emit('yourID', socket.id);

  io.sockets.emit('allUsers', users);

  socket.on('disconnect', function deleteUserFromUsers() {
    delete users[socket.id];
    io.sockets.emit('disconnect', socket.id);
  });

  socket.on('callUser', function sendDataToCalledUser(data) {
    io.to(data.userToCall).emit('hey', {
      from: data.from,
      signal: data.signalData,
    });
  });

  socket.on('acceptCall', function finalizeHandshake(data) {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(8000, () => console.log('server is running on port 8000'));
