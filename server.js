// Module Dependencies
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const securityUtils = require('./utils/securityUtils.js');

// Global variables
const app = express();
const port = process.env.PORT || 3000;

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

//Connects itemlist controller
const itemlistController = require('./controllers/itemlist.js');
app.use('/items', itemlistController);
const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

// Start the server
app.listen(port, ()=>{
  console.log("Server listening on port", port);
});
