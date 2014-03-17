angular.module( 'core9Dashboard',  [
  'ui.router',
  'core9Dashboard.extensions',
  'core9Dashboard.adminplugin.feature'
])
.config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise( '/home' );
})
.controller('AppCtrl', function($scope) {
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = toState.data.pageTitle + ' | Core9 Admin Dashboard' ;
		}
	});
	$scope.$on('$error', function(event, message) {
		$scope.error = message;
	});
	$scope.close = function() {
		$scope.error = '';
	};
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
  'core9.formgenerator',
  'templates-module-cms'
])



.run(function(MenuService) {
	MenuService.add('main', {title: "Dashboard", link: '/', weight: 0});
})


;