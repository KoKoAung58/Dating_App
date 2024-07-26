// const express = require('express');
// const path = require('path');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.json());

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'client', 'build')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });

// // Handle other routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });

// io.on('connection', (socket) => {
//     socket.on('join-room', (roomId, userId) => {
//         socket.join(roomId);
//         socket.broadcast.to(roomId).emit('user-connected', userId);

//         socket.on('disconnect', () => {
//             socket.broadcast.to(roomId).emit('user-disconnected', userId);
//         });

//         socket.on('signal', (data) => {
//             io.to(data.to).emit('signal', data);
//         });
//     });
// });

// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join-room', (roomId, userId) => {
    if (!users[roomId]) {
      users[roomId] = [];
    }
    users[roomId].push(userId);
    socket.join(roomId);

    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      users[roomId] = users[roomId].filter(id => id !== userId);
      socket.to(roomId).emit('user-disconnected', userId);
    });

    socket.on('signal', (data) => {
      socket.to(roomId).emit('signal', data);
    });
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
