angular.module('core9Dashboard.config.contentref', [
	'core9.formgenerator',
	'core9Dashboard.config'
])

.controller('ContentRefConfigController', function($scope, ConfigFactory) {
	$scope.contenttypes = ConfigFactory.query({configtype: 'content'}, function() {
		assignContentType();
	});

	$scope.$watch('data.contenttype', function() {
		assignContentType();
	});

	function assignContentType() {
		if($scope.data.contenttype !== undefined) {
			for(var i = 0; i < $scope.contenttypes.length; i++) {
				if($scope.contenttypes[i].name === $scope.data.contenttype) {
					$scope.contenttype = $scope.contenttypes[i];
					$scope.field['properties'] = {key: {type: 'string'}, value: {type: 'string'}};
				}
			}
		}
	}
})

.controller('ContentRefController', function($scope, ContentFactory) {
	$scope.contentList = {};
	
	ContentFactory.query({contenttype: $scope.options.contenttype}, function(data) {
		for(var i = 0; i < data.length; i++) {
			$scope.contentList[data[i]._id] = data[i][$scope.options.contentfield];
		}
	});

	$scope.$watch('data', function() {
		if($scope.data !== undefined) {
			$scope.selected = $scope.data.value;
		}
	});

	$scope.$watch('selected', function(newVal, oldVal) {
		if(newVal !== undefined && newVal !== oldVal) {
			$scope.data['key'] = $scope.contentList[$scope.selected];
			$scope.data['value'] = $scope.selected;
		}
	});
})

.run(function(FieldConfig) {
	FieldConfig.get('object').addWidget('contentref', {template: "config/contentref/contentref.tpl.html", config: "config/contentref/contentref.config.tpl.html"}).save();
})

;

