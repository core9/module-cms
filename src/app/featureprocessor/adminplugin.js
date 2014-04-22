angular.module( 'core9Dashboard.adminplugin.feature', [
  'ui.bootstrap'
])

.controller("FeatureProcessorAdminPluginCtrl", function($scope) {
  $scope.dependencies = [];

	$scope.add = function(file) {
		$scope.$parent.selected.push({file: file, dependencies: $scope.dependencies});
		$scope.showForm = false;
	};

	$scope.remove = function(index) {
		$scope.$parent.selected.splice(index, 1);	
	};
})

;