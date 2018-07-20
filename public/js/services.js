///////////////////////////////////////////////////////////
// UserInfo Service
// a service that retrieves the current user info
///////////////////////////////////////////////////////////
const UserInfo = function($http) {
  this.$http = $http;
};

// it needs the $http service
UserInfo.$inject = ['$http'];

// The method to get the user info from the backend
UserInfo.prototype.get = async function() {
  let info = null;
  try {
    let response = await this.$http({ method: 'GET', url: '/sessions' });
    info = response.data;
  } catch (err) {
    if (err.status != 401) {
      // Log for debugging purposes
      console.log('UserInfo Service Error:', err);
    }
  }
  return info
};
