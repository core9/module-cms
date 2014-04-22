angular.module( 'core9Dashboard',  [
  'ui.router',
  'core9Dashboard.extensions',
  'core9Dashboard.adminplugin.feature'
])
.config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise( '/home' );
})
.controller('AppCtrl', function($state, $scope) {
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = toState.data.pageTitle + ' | Core9 Admin Dashboard' ;
		}
		if($state.current.data.context !== undefined) {
			$scope.context = $state.current.data.context;
		} else {
      $scope.context = "";
    }
		if($state.current.data.sidebar !== undefined) {
			$scope.sidebar = $state.current.data.sidebar;
		} else {
			$scope.sidebar = $state.current.name;
		}
	});
	$scope.$on('$error', function(event, message) {
		$scope.error = message;
	});
	$scope.close = function() {
		$scope.error = '';
	};
	$scope.collapseMenu = true;
	$scope.menu = "main";
	$scope.sidebar = "main";
})
.filter('getByProperty', function() {
	return function(propertyName, propertyValue, collection) {
		var i=0, len=collection.length;
		for (; i<len; i++) {
			if (collection[i][propertyName] === propertyValue) {
				return collection[i];
			}
		}
		return null;
	};
})
;
angular.module( 'core9Dashboard.admin.dashboard', [
  'ui.router',
  'core9Dashboard.home',
  'core9Dashboard.config',
  'core9Dashboard.content',
  'core9Dashboard.menu',
  'core9Dashboard.menuEditor',
  //'core9Dashboard.account',
  'core9.formgenerator',
  'templates-module-cms'
])



.run(function(MenuService) {
	MenuService.add('main', {title: "Dashboard", link: 'home', weight: 0});
  MenuService.add('back', {title: "Back", template: "<a href=\"javascript:window.history.back()\">Back</a>", weight: 0});
})


;
