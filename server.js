// Module Dependencies
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

// Custom Modules
const securityUtils = require('./utils/securityUtils.js');

// Global variables
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackhole_market';

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: securityUtils.genRandomKey(),
  store: new MemoryStore({
    // Remove expired every 24 hours (1000ms x 60s x 60m x 24h = 86400000)
    checkPeriod: 86400000
  })
}));

// Routes for various controllers
const userController = require('./controllers/users.js');
app.use('/users', userController);
const itemlistController = require('./controllers/itemlist.js');
app.use('/items', itemlistController);
const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

// Connect to the DB
mongoose.connect(mongoUri, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => console.log('Mongoose error:', err));
mongoose.connection.once('open', ()=> console.log('Mongoose connection open...'));

// Start a socket.io connection
const http = require('http').Server(app);
const socket_io = require('socket.io')(http);
socket_io.on('connection', (socket)=>{
  // Listen for 'new_message' events
  socket.on('new_message', (message)=>{
    // Let everyone else know about the message
    socket.broadcast.emit('new_message', message);
  });
});

// Start the server
http.listen(port, ()=>{
  console.log("Server listening on port", port);
});
