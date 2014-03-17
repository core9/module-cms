angular.module( 'core9Dashboard.adminplugin.feature', [
  'ui.bootstrap'
])

.controller("FeatureProcessorAdminPluginCtrl", function($scope) {
	$scope.add = function(module, file) {
		$scope.$parent.selected.push({module: module, file: file});
		$scope.showForm = false;
	};

	$scope.remove = function(index) {
		$scope.$parent.selected.splice(index, 1);	
	};
})

;