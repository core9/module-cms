/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module('core9Dashboard.config', [
  'ngResource',
  'ui.router',
  'core9Dashboard.menu'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function($stateProvider) {
  $stateProvider.state('config', {
    url: '/config',
    views: {
      "main": {
        controller: 'ConfigCtrl',
        templateUrl: 'config/config.tpl.html'
      }
    },
    data:{ pageTitle: 'Configuration' }
  });
})


.controller('ConfigCtrl', function($scope, MenuService) {
  $scope.title = "Config";
})

.factory('ConfigFactory', function($resource) {
  return $resource('/admin/config/:configtype/:id',
          {configtype: '@configtype', id: '@_id'},
          {update: {method: 'PUT' }}
  );
})

.run(function(MenuService) {
  MenuService.add('main', {title: "Config", link: "/config", weight: 100, submenu: 'config'});
})

;

