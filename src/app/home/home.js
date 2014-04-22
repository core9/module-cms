angular.module( 'core9Dashboard.home', [
  'ui.router'
])

.config(function($stateProvider) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ 
      pageTitle: 'Home',
      sidebar: 'main'
    }
  });
})

.controller( 'HomeCtrl', function ($scope, $http) {
  $scope.login = function() {
    $http.post("/system/login", {username: $scope.username, password: $scope.password})
    .success(function(data) {
      console.log("Logged in");
    })
    .error(function(error) {
      $scope.$emit("$error", error.content);
    });
  };
})

;

