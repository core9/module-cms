angular.module( 'core9Dashboard.account', [
  'ui.router',
  'core9Dashboard.menu'
])

.config(function($stateProvider) {
  $stateProvider.state( 'account', {
    url: '/account',
    views: {
      "main": {
        controller: 'AccountCtrl',
        templateUrl: 'account/account.tpl.html'
      }
    },
    data:{ 
      pageTitle: 'Home',
      sidebar: 'account'
    }
  });
})

.controller( 'AccountCtrl', function($scope) {
	$scope.$watch('name', function () {
		if($scope.name === 'alert') {
			alert("Hoi");
		}
	});
})

.run(function(MenuService) {
	MenuService.add('main', {title: "Account", weight: '1000', link: "account"});
	MenuService.add('account', {title: "Delete", weight: '1000', link: "account"});
	MenuService.add('account', {title: "Edit", weight: '1200', link: "account"});
	MenuService.add('account', {title: "Back", weight: '1300', link: "account"});
})

;

