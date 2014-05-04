angular.module( 'core9Dashboard.aliases', [
  'ui.router'
])

.config(function($stateProvider) {
  $stateProvider.state( 'aliases', {
    url: '/aliases',
    views: {
      "main": {
        controller: 'AliasesCtrl',
        templateUrl: 'aliases/aliases.tpl.html'
      }
    },
    data:{ 
      pageTitle: 'Aliases',
      sidebar: 'config',
      context: 'aliases'
    }
  });
})

.controller( 'AliasesCtrl', function ($scope, ConfigFactory) {
  ConfigFactory.query({configtype: 'aliases'}, function (data) {
    if(data.length > 0) {
      $scope.aliasConf = data[0];
    }
  });

  $scope.createAliasConf = function () {
    var aliasConf = new ConfigFactory();
    aliasConf.configtype = "aliases";
    aliasConf.name = "aliases";
    aliasConf.aliases = [];
    aliasConf.$save();
    $scope.aliasConf = aliasConf;
  };

  $scope.save = function () {
    $scope.aliasConf.$update(function () {
      alert("Saved");
    });
  };
})

.run(function (MenuService) {
  MenuService.add('config', {title: "Aliases", weight: 250, link: "aliases"});
  MenuService.add('aliases', {title: "Save", weight: 0, 
    template: "<a><button style=\"width: 100%\" ng-controller=\"AliasesCtrl\" class=\"btn btn-success\" href=\"\" ng-click=\"save()\">Save aliases</button></a>"});
})

;

