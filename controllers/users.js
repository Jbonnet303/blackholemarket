const express = require('express');
const router = express.Router();

// Common helper functions
const securityUtils = require('../utils/securityUtils.js');
const validationUtils = require('../public/js/validation.js');

// DB connectivity
const User = require('../models/users.js');

// Common function to reject user creation
const badRequest = (res, message) => {
  res.status(400).json({
    status:400,
    message:message
  });
}

// Create a new user
router.post('/', function(req, res){
  // Clean the input
  let username = validationUtils.cleanString(req.body.username);
  let password = validationUtils.cleanString(req.body.password);
  // Validate the username is acceptable
  let userError = validationUtils.validateUsername(username);
  if (userError) {
    // Username didn't meet requirements
    badRequest(res, userError);
    return;
  }
  // Validate the password is acceptable
  let passError = validationUtils.validatePassword(password);
  if (passError) {
    // Password didn't meet requirements
    badRequest(res, passError);
    return;
  }
  // Build up the new user object
  let newUser = {
    // internalName is the username lowercased so that login/search is not case sensative
    internalName: username.toLowerCase(),
    // username is exactly what the user typed and will be used for display
    username: username,
    // password is hashed so we don't store their actual password
    password: securityUtils.hash(password)
  }
  // Search to see if the user already exists
  User.findOne({internalName: newUser.internalName}, (err, foundUser)=>{
    if (err) {
      // Database failed during user search
      console.log('Failed to create user:', err);
      res.status(500).json({
        status:500,
        message:'Internal error while attempting to create user'
      });
    } else if (foundUser) {
      // The username is already in use
      badRequest(res, 'The provided username is already in use.');
    } else {
      // No error and nothing was found so we can actually create the user
      User.create(newUser, (err1, createdUser)=>{
        if (err1) {
          // Database failed to create user
          console.log('Failed to create user:', err1);
          res.status(500).json({
            status:500,
            message:'Internal error while attempting to create user'
          });
        } else {
          res.status(201).json({
            status:201,
            message: "user created"
          });
        }
      }); // End of User.create
    }
  }); // End of User.findOne
});

module.exports = router;
