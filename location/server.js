// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve your HTML and other static files
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // // Handle delivery boy's location updates
    // socket.on('updateLocation', (data) => {
    //     // Broadcast the location update to all connected clients
    //     io.emit('updateLocation', data);
    // });

    // Handle delivery boy's location updates
  const js = fs.readFile('./public/index.js','utf-8',(err,data)=>{
    socket.emit('script',data);
  });
    // socket.on('updateLocation', (data) => {
    //     // Broadcast the location update to all connected clients
    //     io.emit('updateLocation', data);
    // });


    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


