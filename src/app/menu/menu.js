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

.directive('cnmenu', function(MenuService) {
  return {
    restrict: 'A',
    templateUrl: 'menu/menu.tpl.html',
    scope: {
      // cnmenu: '='
    },
    link: function(scope, elem, attrs) {
      scope.menu = MenuService.menu[attrs.cnmenu];
    }
  };
})

.directive('cnmenuitem', function($compile) {
  return {
    restrict: 'A',
    scope: {
      item: '=cnmenuitem'
    },
    link: function(scope, element, attrs) {
      var template = '<a href="#{{item.link}}">{{item.title}}</a>';
      if(scope.item.submenu !== undefined) {
        template += '<div cnmenu="' + scope.item.submenu + '"></div>';
      }
      var newElement = angular.element(template);
      $compile(newElement)(scope);
      element.replaceWith(newElement);
    }
  };
})

;