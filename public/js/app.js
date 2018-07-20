// Create the angular app
const app = angular.module("BHMApp", []);

// The main controller
app.controller("MainController", function() {
  // A trick to make referencing controller variables the same
  // from the index.html and inside the folder
  const ctrl = this;
  // All references from now on will user ctrl.<ref> instead of
  // this.<ref>
  ctrl.title = "Blackhole Market";
})
