angular.module('core9Dashboard.content', [
  'ui.router',
  'ngResource',
  'core9Dashboard.config.content',
  'core9Dashboard.config.contentref',
  'core9Dashboard.content.references',
  'core9.formgenerator'
  ])

.factory('ContentFactory', function($resource) {
  return $resource('/admin/content/:contenttype/:id',
    {contenttype: '@contenttype', id: '@_id'},
    {update: {method: 'PUT' }}
    );
})

.config(function ($stateProvider) {
  $stateProvider.state('content', {
    abstract: true,
    views: {
      "main": {
        controller: 'ContentCtrl',
        template: '<div ui-view></div>'
      }
    },
    data: {
      pageTitle: 'Content',
      sidebar: 'content',
      context: 'contentcontext'
    }
  })
  .state('content.default', {
    url: '/content',
    controller: 'ContentListCtrl',
    templateUrl: 'content/contentlist.tpl.html'
  })
  .state('content.type', {
    url: '/content/:type',
    controller: 'ContentListCtrl',
    templateUrl: 'content/contentlist.tpl.html'
  })
  .state('content.item', {
    url: '/content/:type/:id',
    controller: 'ContentItemCtrl',
    templateUrl: 'content/content.item.tpl.html'
  });
})

.controller('ContentCtrl', function() {})

.controller('ContentListCtrl', function($scope, ConfigFactory, ContentFactory, $state, $stateParams) {
  $scope.contenttypes = ConfigFactory.query({configtype: 'content'}, function (data) {
    if($stateParams.type !== undefined) {
      for(var i = 0; i < data.length; i++) {
        if(data[i]._id === $stateParams.type) {
          $scope.contenttype = data[i];
        }
      }
    }
  });
	$scope.$watch('contenttype', function() {
		if($scope.contenttype !== undefined && $scope.contenttype.name !== undefined) {
			$scope.contentlist = ContentFactory.query({contenttype: $scope.contenttype.name});
		}
	});

	$scope.add = function() {
		var content = new ContentFactory();
    content.$save({contenttype: $scope.contenttype.name}, function(data) {
      $scope.contentlist.push(data);
      $state.go("content.item", {type: $scope.contenttype._id, id: data._id});
    });
  };

  $scope.edit = function(data) {
    $state.go("content.item", {type: $scope.contenttype._id, id: data._id});
  };

  $scope.remove = function(data) {
    var item = new ContentFactory(data);
    item.$remove(function() {
      $scope.contentlist = ContentFactory.query({contenttype: $scope.contenttype.name});
    });
  };
})

.controller('ContentItemCtrl', function($scope, $stateParams, $state, ContentFactory, ConfigFactory) {
  $scope.contenttype = ConfigFactory.get({configtype: 'content', id: $stateParams.type}, function() {
    var item = ContentFactory.get({contenttype: $scope.contenttype.name, id: $stateParams.id}, function() {
      $scope.item = item;
    });
  });
  
  $scope.save = function() {
    $scope.item.$update();
    $state.go('content.type', {type: $stateParams.type});
  };
})

.run(function(MenuService, ConfigFactory) {
  MenuService.add('main', {title: "Content", weight: 50, link: "content.default"});
  MenuService.add('content', {title: "Content", weight: 0, link: "content.default"});
  ConfigFactory.query({configtype: 'content'}, function(data) {
    for(var i = 0; i < data.length; i++) {  
      MenuService.add('contentcontext', {title: data[i].label, weight: '50', link: "content.type({type: \"" + data[i]._id + "\"})"});
    }
  });
})
;