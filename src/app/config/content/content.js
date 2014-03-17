angular.module('core9Dashboard.config.content', [
  'ui.sortable',
  'ui.router',
  'core9Dashboard.config',
  'core9Dashboard.menu',
  'core9.formgenerator'])

.config(function($stateProvider) {
  $stateProvider
  .state('configcontenttypelist', {
    url: '/config/content',
    views: {
      "main": {
        controller: 'ConfigContentCtrl',
        templateUrl: 'config/content/content.tpl.html'
      }
    },
    data:{ pageTitle: 'Configuration' }
  })
  .state('configcontenttype', {
    url: '/config/contenttype/:id',
    views: {
      "main": {
        controller: 'ConfigContentTypeCtrl',
        templateUrl: 'config/content/type.tpl.html'
      }
    },
    data:{ pageTitle: 'Configuration' }
  });
})

.controller('ConfigContentCtrl', function($scope, ConfigFactory, $state) {
  $scope.contenttypes = ConfigFactory.query({configtype: 'content'});
  $scope.addType = function(name) {
    var config = new ConfigFactory();
    config.name = name;
    config.$save({configtype: 'content'}, function(data) {
      $scope.contenttypes.push(data);
    });
  };
  $scope.editType = function(type) {
    $state.go("configcontenttype", {id: type._id});
  };
  $scope.removeType = function(type) {
    type.$remove(function(data) {
      $scope.contenttypes = ConfigFactory.query({configtype: 'content'});
    });
  };
})

.controller('ConfigContentTypeCtrl', function($scope, ConfigFactory, $stateParams, $location, $state) {
  $scope.contenttype = ConfigFactory.get({configtype: 'content', id: $stateParams.id});
  $scope.state = {};

  $scope.addField = function(newLabel, newName) {
    if($scope.contenttype.schema === undefined) {
      $scope.contenttype.schema = {title: $scope.contenttype.name, type: 'object', properties: {}};
    }
    if($scope.contenttype.schemaOptions === undefined) {
      $scope.contenttype.schemaOptions = {};
    }
    $scope.contenttype.schema.properties[newName] = {};
    $scope.contenttype.schemaOptions[newName] = {label: newLabel};
    $scope.newLabel = $scope.newName = "";
  };

  $scope.removeField = function(fieldName) {
    delete($scope.contenttype.schema.properties[fieldName]);
    delete($scope.contenttype.schemaOptions[fieldName]);
    $state.go('configcontenttype');
  };

  $scope.editField = function(fieldName) {
    $scope.editfield = $scope.contenttype.schema.properties[fieldName];
    $scope.editfieldOptions = $scope.contenttype.schemaOptions[fieldName];
  };

  $scope.save = function() {
    $scope.contenttype.$update();
    $state.go('configcontenttypelist');
  };

  $scope.remove = function() {
    $scope.contenttype.$remove(function(data) {
      $location.path("/config/content");
    });
  };
})

.run(function(MenuService, FieldConfig) {
  MenuService.add('config', {title: 'Content', link: '/config/content', weight: 100});
})



;
