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
    this.currentInfo = response.data;
  } catch (err) {
    if (err.status != 401) {
      // Log for debugging purposes
      console.log('UserInfo Service Error:', err);
    }
  }
  return this.currentInfo;
};
