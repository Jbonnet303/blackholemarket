///////////////////////////////////////////////////////////
// UserInfo Service
// a service that retrieves the current user info
///////////////////////////////////////////////////////////
const UserInfo = function($http) {
  this.$http = $http;
  this.currentInfo = null;
};

// it needs the $http service
UserInfo.$inject = ['$http'];

// A method to set the user info
UserInfo.prototype.set = function(info) {
  this.currentInfo = info;
};

// A method to get whatever the current value is
UserInfo.prototype.get = function() {
  return this.currentInfo;
};

// A method to get the user info from the backend
UserInfo.prototype.refresh = async function() {
  try {
    let response = await this.$http({ method: 'GET', url: '/sessions' });
    // The responce might be empty so make sure to confirm it is a valid object
    if (response.data._id) {
      // It is an actual user object
      this.currentInfo = response.data;
    } else {
      // Not a user object (it's most likely an empty object)
      this.currentInfo = null;
    }
  } catch (err) {
    if (err.status != 401) {
      // Log for debugging purposes
      console.log('UserInfo Service Error:', err);
    }
  }
  return this.currentInfo;
};
