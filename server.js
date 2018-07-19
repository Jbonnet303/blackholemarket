// Module Dependencies
const express = require('express')

// Global variables
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));

// Start the server
app.listen(port, ()=>{
  console.log("Server listening on port", port);
});
