angular.module('core9Dashboard.menu', [])
.service('MenuService', function($rootScope) {
  return {
    menu: [],
    add: function(menuName, item) {
      if(this.menu[menuName] === undefined) {
        this.menu[menuName] = [];
      }
      this.menu[menuName].push(item);
      $rootScope.$broadcast( 'MenuService.update', this.menu );
    }
  };
})

.directive('coreMenu', function(MenuService) {
  return {
    replace: true,
    restrict: 'A',
    templateUrl: 'menu/menu.tpl.html',
    scope: {
      menu: '=coreMenu'
    },
    link: function(scope, elem, attrs) {
      scope.$watch('menu', function() {
        scope.thismenu = MenuService.menu[scope.menu];
      });
    }
  };
})

.directive('coreMenuItem', function($compile) {
  return {
    restrict: 'A',
    scope: {
      item: '=coreMenuItem'
    },
    link: function(scope, element, attrs) {
      var template = scope.item.template;
      if(template !== undefined) {
        var newElement = angular.element(template);
        $compile(newElement)(scope);
        element.replaceWith(newElement);   
      }
    }
  };
})

;