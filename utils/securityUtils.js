// Module dependencies
const bcrypt = require('bcrypt');

// A JSON response to a failed authentication
const authFailedJson = (res, message=null) => {
  res.status(401).json({
    status:401,
    message:(message ? message : 'Authentication failure')
  });
}

// Returns a funtion to check whether the client is logged in and
// optionally if the client is admin
// In the case of unauthorized access, the unauthorized callback will be called
// if provided otherwise a simple 401 status is returned
const genMiddlewareFunc = (
    sessionKey='authUser',
    adminFlag=null,
    unauthorizedCallback = null,
    exceptions=[]) => {
  return (req, res, next) => {
    // Check if the path is one of the exceptions
    let destination = req.path.trim().toLowerCase();
    for (let ePath of exceptions) {
      if (ePath.toLowerCase() == destination) {
        // This particular path is not secured
        next();
        // Make sure this middleware stops processing
        return;
      }
    }
    // Enforce the security
    let finalDest = req.baseUrl+req.path;
    // First check that the session object exists which indicates a logged in user
    if (req.session[sessionKey]) {
      // Next check if the user has the correct permissions
      let hasAccess = (adminFlag==null || req.session[sessionKey][adminFlag]);
      if (hasAccess) {
        // The user has the appropriate access
        next();
        // Make sure this middleware stops processing
        return;
      } else {
        console.log(`Non-admin attempt to access: ${finalDest}`);
      }
    } else {
      console.log(`Unauthenticated attempt to access: ${finalDest}`);
    }
    // Either call the provided call back or return a 401 status
    if (unauthorizedCallback) {
      unauthorizedCallback(req, res);
    } else {
      // Default behavior on unauthenticated
      authFailedJson(res);
    }
  };
}

// A simple middleware function to ensure that the user is authenticated
module.exports.authenticated = (
    sessionKey='authUser',
    unauthorizedCallback=null,
    exceptions=[]) => {
  return genMiddlewareFunc(sessionKey, null, unauthorizedCallback, exceptions);
}

// A simple middleware function to ensure that the user is authenticated and admin
module.exports.admin = (
    sessionKey='authUser',
    adminFlag='isAdmin',
    unauthorizedCallback=null,
    exceptions=[]) => {
  return genMiddlewareFunc(sessionKey, adminFlag, unauthorizedCallback, exceptions);
}

// Let this function be used by others
module.exports.authFailedJson = authFailedJson;

// A helper function to hash a string
module.exports.hash = (str, raw=false) => {
  let toHash = (raw ? str : (str+'').trim());
  return bcrypt.hashSync(toHash, bcrypt.genSaltSync(10));
}

// A helper function to check a string against a hash
module.exports.matchesHash = (str, hash, raw=false) => {
  let toMatch = (raw ? str : (str+'').trim());
  return bcrypt.compareSync(toMatch, hash);
}

// Generate a pseudo-random string of chars of a particular length
module.exports.genRandomKey = (length=64) => {
  let hash = ''
  while (hash.length < length) {
    hash += Math.random().toString(36).substring(2);
  }
  return hash.substring(0, length);
}
