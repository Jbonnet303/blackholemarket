// Create the angular app
const app = angular.module("BHMApp", []);

// The main controller
app.controller("MainController", ['$http', function($http) {
  // A trick to make referencing controller variables the same
  // from the index.html and inside the folder
  const ctrl = this;
  // All references from now on will user ctrl.<ref> instead of
  // this.<ref>
  ctrl.title = "Blackhole Market";
  ctrl.credBtnText = 'log in';
  ctrl.credErrorMessage = '';
  ctrl.isLogIn = true;
  ctrl.curUser = null;
  ctrl.creds = {};

  // Changes the functionality of the cred form
  ctrl.toggleCredFormType = (makeLogIn) => {
    ctrl.isLogIn = !ctrl.isLogIn;
    if (ctrl.isLogIn) {
      ctrl.credBtnText = 'log in';
    } else {
      ctrl.credBtnText = 'sign up';
    }
  }

  // Clears out the create user/log in form
  // When cleared, it always resets to a log in form
  ctrl.resetCredForm = () => {
    ctrl.creds = {};
    ctrl.isLogIn = true;
    ctrl.credErrorMessage = '';
    ctrl.credBtnText = 'log in';
  }

  // Perform the correct action when the cred button is pressed
  ctrl.submitCredForm = () => {
    if (ctrl.isLogIn) {
      ctrl.doLogIn();
    } else {
      ctrl.doSignUp();
    }
  }

  // Get the user information for the logged in user
  ctrl.getUserInfo = () => {
    $http({
      method: 'GET',
      url: '/sessions'
    }).then((response)=>{
      // Keep track of the logged in user
      ctrl.curUser = response.data;
    }, (error)=>{
      // Ignore unauthenticated errors
      if (error.status != 401) {
        // Log error for debugging purposes
        console.log("HTTP Error:", error);
      }
    }).catch((err)=>{ console.log("Promise Error:", err); });
  }

  // Log out of the page
  ctrl.doLogOut = () => {
    // Call the session log out route in the backend
    $http({
      method: 'DELETE',
      url: '/sessions'
    }).then((response)=>{
      // Reset the current user object
      ctrl.curUser = null;
    }, (error)=>{
      // Log error for debugging purposes
      console.log("HTTP Error:", error);
    }).catch((err)=>{ console.log("Promise Error:", err); });
  }

  // Attempt to log in to the market
  ctrl.doLogIn = () => {
    // Call the session log in route in the backend
    $http({
      method: 'POST',
      url: '/sessions',
      data: ctrl.creds
    }).then((response)=>{
      // Keep track of the logged in user
      ctrl.curUser = response.data;
      // Clear the form
      ctrl.resetCredForm();
    }, (error)=>{
      // Display the error message
      ctrl.credErrorMessage = error.data.message;
      if (error.status != 401) {
        // Log non-401 errors for debugging purposes
        console.log("HTTP Error:", error);
      }
    }).catch((err)=>{ console.log("Promise Error:", err); });
  }

  // Attempt to sign up for the market
  ctrl.doSignUp = () => {
    // Validate the inputs first
    let userError = validateUsername(ctrl.creds.username);
    if (userError) {
      // The username wasn't valid
      ctrl.credErrorMessage = userError;
      return;
    }
    let passError = validateUsername(ctrl.creds.password);
    if (passError) {
      // The username wasn't valid
      ctrl.credErrorMessage = passError;
      return;
    }
    // Call the session log in route in the backend
    $http({
      method: 'POST',
      url: '/users',
      data: ctrl.creds
    }).then((response)=>{
      // Clear the form
      ctrl.resetCredForm();
      // Grab the new user information
      ctrl.getUserInfo();
    }, (error)=>{
      // Display the error message
      ctrl.credErrorMessage = error.data.message;
      if (error.status != 400) {
        // Log non-400 errors for debugging purposes
        console.log("HTTP Error:", error);
      }
    }).catch((err)=>{ console.log("Promise Error:", err); });
  }

  // Call to get the user info on load to restore a session on a page refresh
  ctrl.getUserInfo();
}])
