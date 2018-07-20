const express = require('express');
const router = express.Router();

// Common helper functions
const securityUtils = require('../utils/securityUtils.js');
const validationUtils = require('../public/js/validation.js');

// DB connectivity
const User = require('../models/users.js');

// Get the logged in user info
router.get('/', (req, res)=>{
  if(req.session.loggedInUser){
    res.json(req.session.loggedInUser);
  } else {
    securityUtils.authFailedJson(res);
  }
});

// Destroy a session
router.delete('/', (req, res)=>{
  // Make sure the user is logged out (in case something fails with the destroy)
  req.session.loggedInUser = null;
  // Destroy the session
  req.session.destroy(() => {
    // Respond to the caller with a success status
    res.status(200).json({
      status:200,
      message:'log out complete'
    });
  })
});

// Create a new session
router.post('/', (req, res)=>{
  let badCreds = 'Invalid username/password combination';
  // Clean the input
  let internalName = validationUtils.cleanString(req.body.username).toLowerCase();
  let password = validationUtils.cleanString(req.body.password);
  if (internalName.length==0 || password.length==0) {
    // Shortcut if either value is missing
    securityUtils.authFailedJson(res, badCreds);
  } else {
    // Try to authenticate the user
    User.findOne({internalName: internalName}, (err, foundUser)=>{
      if (err) {
        // Error came back from the database
        console.log("Error trying to authenticate user:", err);
        res.status(500).json({
          status:500,
          message:'Internal error while attempting to authenticate user'
        });
      } else if (foundUser) {
        // A user was returned so check their password
        if(securityUtils.matchesHash(password, foundUser.password)){
          // Password matched so store the user to the session and return success
          req.session.loggedInUser = foundUser;
          res.status(200).json({
            status:200,
            message:'log in successful'
          });
        } else {
          // Passwords don't match
          securityUtils.authFailedJson(res, badCreds);
        }
      } else {
        // No error but no user was returned - username must not have matched
        securityUtils.authFailedJson(res, badCreds);
      }
    })
  }
});

// Export the router for use by the server
module.exports = router;
