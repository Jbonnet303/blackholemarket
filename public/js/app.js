// Create the angular app
const app = angular.module("BHMApp", []);

// Register the userInfo service
app.service('$userInfo', UserInfo);

// The main controller
app.controller("MainController", ['$scope', '$http', '$userInfo', function($scope, $http, $userInfo) {
  // A trick to make referencing controller variables the same
  // from the index.html and inside the controller
  const ctrl = this;
  // All references from now on will use ctrl.<ref> instead of this.<ref>
  ctrl.title = "Blackhole Market";
  ctrl.curUser = null;

  // Simple helper function to set the user info (shares it with the chat controller)
  ctrl.setCurUser = (info) => {
    ctrl.curUser = info;
    $userInfo.set(info);
  }

  // Changes the functionality of the cred form
  ctrl.toggleCredFormType = (makeLogIn) => {
    ctrl.isLogIn = !ctrl.isLogIn;
    if (ctrl.isLogIn) {
      ctrl.credBtnText = 'log in';
    } else {
      ctrl.credBtnText = 'sign up';
    }
    ctrl.credErrorMessage = '';
  }

  // Clears out the create user/log in form
  // When cleared, it always resets to a log in form
  ctrl.resetCredForm = () => {
    ctrl.isLogIn = true;
    ctrl.credErrorMessage = '';
    ctrl.credBtnText = 'log in';
    ctrl.creds = {username:'', password:''};
  }

  // Perform the correct action when the cred button is pressed
  ctrl.submitCredForm = () => {
    if (ctrl.isLogIn) {
      ctrl.doLogIn();
    } else {
      ctrl.doSignUp();
    }
  }

  // Log out of the page
  ctrl.doLogOut = async () => {
    try {
      // Call the session log out route in the backend
      await $http({method: 'DELETE', url: '/sessions'});
      // Clear the current user object
      ctrl.setCurUser(null);
    } catch (error) {
      // Log errors for debugging purposes
      console.log("Log Out Error:", error);
    } finally {
      // Make sure the page refelcts the model changes
      $scope.$apply();
    }
  }

  // Attempt to log in to the market
  ctrl.doLogIn = async () => {
    try {
      // Call the session log in route in the backend
      await $http({method: 'POST', url: '/sessions', data: ctrl.creds});
      // Get the updated user info
      let info = await $userInfo.refresh();
      // Update the current user object
      ctrl.setCurUser(info);
      // Clear the form
      ctrl.resetCredForm();
    } catch (error) {
      // Display the error message
      ctrl.credErrorMessage = error.data.message;
      if (error.status != 401) {
        // Log non-401 errors for debugging purposes
        console.log("Log In Error:", error);
      }
    } finally {
      // Make sure the page refelcts the model changes
      $scope.$apply();
    }
  }

  // Attempt to sign up for the market
  ctrl.doSignUp = async () => {
    try {
      // Validate the inputs first
      let userError = validateUsername(ctrl.creds.username);
      if (userError) {
        // The username wasn't valid
        ctrl.credErrorMessage = userError;
        return false;
      }
      let passError = validateUsername(ctrl.creds.password);
      if (passError) {
        // The username wasn't valid
        ctrl.credErrorMessage = passError;
        return false;
      }
      // Call the user create route in the backend
      await $http({method: 'POST', url: '/users', data: ctrl.creds});
      // Get the updated user info
      let info = await $userInfo.refresh();
      // Update the current user object
      ctrl.setCurUser(info);
      // Clear the form
      ctrl.resetCredForm();
    } catch (error) {
      // Display the error message
      ctrl.credErrorMessage = error.data.message;
      if (error.status != 400) {
        // Log non-401 errors for debugging purposes
        console.log("Sign Up Error:", error);
      }
    } finally {
      // Make sure the page refelcts the model changes
      $scope.$apply();
    }
  }
  //Call to backend to create a new item
  ctrl.createItem = function(){
          $http({
              method:'POST',
              url: '/items/new',
              data: {
                name: ctrl.name,
                img: ctrl.img,
                qty: ctrl.qty,
                price: ctrl.price
              }
          }).then(function(response){
              ctrl.getItems();
          }, function(){
              console.log('error');
          });
      }
  //Call to backend to list all items
  ctrl.getItems = function(){
      $http({
          method:'GET',
          url: '/items',
      }).then(function(response){
          ctrl.items = response.data;
      }, function(){
          console.log('error');
      });
  };
  //Call to backend to delete the item
  ctrl.deleteItem = function(item){
    $http({
        method:'DELETE',
        url: '/items/' + item._id
    }).then(function(response){
          ctrl.getItems();
        }, function(error){
          console.log('error');
        });
      };
  //Call to backend to edit the item
  ctrl.editItem = function(item){
    $http({
        method:'PUT',
        url: '/items/' + item._id,
        data: {
          name: ctrl.updatedName,
          img: ctrl.updatedImg,
          qty: ctrl.updatedQty,
          price: ctrl.updatedPrice
        }
    }).then(function(response){
        ctrl.getItems();
        }, function(error){
          console.log('error');
        });
      };
  // Initialize the login form variables
  ctrl.resetCredForm();
  //Calls all the items to show on the page
  ctrl.getItems();
  // Call to get the user info on load to restore a session on a page refresh
  $userInfo.refresh().then((info)=>{
    // Update the current user object
    ctrl.setCurUser(info);
    // Make sure the page refelcts the model changes
    $scope.$apply();
  });
}])

// A controller for the chat functionality
app.controller("ChatController", ['$scope', '$userInfo', function($scope, $userInfo) {
  // A trick to make referencing controller variables the same
  // from the index.html and inside the controller
  const chat = this;
  // A reference to the chat window DOM object
  const chatWindow = document.getElementById('chat-messages');
  // All references from now on will use chat.<ref> instead of this.<ref>
  chat.message = '';
  chat.receivedMessages = [];

  // A special variable for the socket.io interaction
  chat.socket = io();

  // A function that get's the currently logged in user's name
  const getUsername = () => {
    return $userInfo.get().username;
  }

  // A function to scroll to the bottom of the chat messages
  const scrollToNewMessage = () => {
    // Use vanilla javascript to scroll the window
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Figure out what class should be assigned to the username span
  chat.getUserClass = (username) => {
    return (getUsername()==username ? 'self' : 'stranger');
  }

  // Send a chat message to whomever is connected
  chat.sendMessage = () => {
    let userMessage = cleanString(chat.message);
    // Don't send a message that is only whitespace
    if (userMessage.length > 0) {
      // Build up the message
      let message = {
        user:getUsername(),
        message: userMessage
      };
      // Clear the message input
      chat.message = '';
      // Add it to the user's own chat window
      chat.receivedMessages.push(message);
      // A hack to scroll after the model has refreshed
      setTimeout(scrollToNewMessage, 100);
      // Send it to the other users
      chat.socket.emit('new_message', message);
    }
  }

  // Listen for incoming chat messages
  chat.socket.on('new_message', (message) => {
    // Add the message to the known messages
    chat.receivedMessages.push(message);
    // Make sure the page refelcts the model changes
    $scope.$apply();
    // Scroll after the model has been updated
    scrollToNewMessage();
  });
}])
