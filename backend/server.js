const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const users = {};

io.on('connection', (socket) => {
  if (!users[socket.id]) users[socket.id] = socket.id;

  socket.emit('yourID', socket.id);

  io.sockets.emit('allUsers', users);

  socket.on('disconnect', () => {
    delete users[socket.id];
  });

  socket.on('callUser', (data) => {
    const payload = {
      from: data.from,
      signal: data.signalData,
    };

    io.to(data.userToCall).emit('call', payload);
  });

  socket.on('acceptCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(8000, () => console.log('server is running on port 8080'));
