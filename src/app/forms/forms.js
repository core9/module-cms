angular.module('core9.formgenerator', [])

.factory('FieldConfig', function($templateCache) {
  var fieldsRegistry = {};

  function FieldConfig(config){
    angular.copy(config, this);
  }

  FieldConfig.get = function(name) {
    return new FieldConfig(fieldsRegistry[name]);
  };

  FieldConfig.getAll = function() {
    var keys = [];
    for(var key in fieldsRegistry) {
      keys.push(key);
    }
    return keys;
  };

  FieldConfig.prototype['save'] = function() {
    fieldsRegistry[this.type] = this;
    return fieldsRegistry[this.type];
  };

  FieldConfig.prototype['render'] = function() {
    return $templateCache.get(this.template);
  };

  FieldConfig.prototype['addWidget'] = function(name, widget) {
    if(this.widgets === undefined) {
      this.widgets = {};
    }
    this.widgets[name] = widget;
    return this;
  };

  FieldConfig.prototype['renderconfig'] = function(widget) {
    return $templateCache.get(this.widgets[widget].config);
  };

  return FieldConfig;
})

.directive('cnSchemaGenerator', function($compile, $templateCache, FieldConfig) {
	return {
		replace: true,
		scope: {
			name: '=cnName',
			schema: '=cnSchema',
			data: '=cnData',
			options: '=cnOptions'
		},
		link: function(scope, element, attrs) {
      if(scope.name !== undefined) {
        if(scope.options[scope.name] === undefined) {
          scope.options[scope.name] = {};
        }
        scope.options = scope.options[scope.name];
      }
      
      scope.$watch('options', function() {
        if(scope.options === undefined) {
          scope.options = {widget: "standard", label: scope.name};
        }
        if(scope.options.widget === undefined) {
          scope.options.widget = "standard";
        }
        if(scope.options.label === undefined && scope.name !== undefined) {
          scope.options.label = scope.name;
        }
        scope.render();
      });

			scope.$watch('schema', function() {
				scope.render();
			});

      scope.render = function() {
        if(scope.schema !== undefined && scope.schema.type !== undefined && scope.options !== undefined && scope.options.widget !== undefined) {
          element.html($templateCache.get(FieldConfig.get(scope.schema.type).widgets[scope.options.widget].template));
          $compile(element.contents())(scope);
        }
      };
		}
	};
})

.directive('cnFieldConfig', function(FieldConfig, $compile) {
  return {
    replace: true,
    scope: {
      field: '=',
      data: '='
    },
    link: function(scope, element, attrs) {
      scope.$watch('field', function(newValue, oldValue) {
        element.html("");
        $compile(element.contents())(scope);
        if(newValue !== undefined) {
          element.html(FieldConfig.get(scope.field.type).renderconfig(scope.data.widget));
          $compile(element.contents())(scope);
        }
      });
      scope.$watch('data.widget', function(newValue, oldValue) {
        element.html("");
        $compile(element.contents())(scope);
        if(newValue !== undefined) {
          element.html(FieldConfig.get(scope.field.type).renderconfig(scope.data.widget));
          $compile(element.contents())(scope);
        }
      });
    }
  };
})

.directive('cnFieldOptions', function($templateCache, $compile, FieldConfig) {
  return {
    replace: true,
    scope: {
      field: '=cnField',
      data: '=cnData'
    },
    link: function(scope, element, attrs) {
      scope.fieldtypes = FieldConfig.getAll();

      scope.$watch('field.type', function() {
        if(scope.field !== undefined && scope.field.type !== undefined) {
          scope.fieldType = FieldConfig.get(scope.field.type);
        }
      });

      element.html($templateCache.get('forms/field.tpl.html'));
      $compile(element.contents())(scope);
    }
  };
})

.controller('coreArrayController', function($scope, FieldConfig) {
  $scope.name = 'items';
  $scope.addItem = function() {
    if($scope.schema.items.type === 'object') {
      $scope.data.push({});
    } else if($scope.schema.items.type === 'array') {
      $scope.data.push([]);
    } else {
      $scope.data.push("");
    }
  };
})

.controller('coreArrayConfigController', function($scope, FieldConfig) {
  $scope.fieldtypes = FieldConfig.getAll();
  if($scope.field.items === undefined) {
    $scope.field.items = {};  
  }
  if($scope.data.items === undefined) {
    $scope.data.items = {};   
  }
  $scope.$watch('field.items.type', function() {
    if($scope.field !== undefined && $scope.field.items !== undefined && $scope.field.items.type !== undefined) {
      $scope.itemsfield = FieldConfig.get($scope.field.items.type);
    }
  });
})

.controller('coreObjectConfigController', function($scope, FieldConfig) {
  if($scope.field.properties === undefined) {
    $scope.field.properties = {};  
  }

  $scope.addField = function(newLabel, newName) {
    $scope.field.properties[newName] = {};
    $scope.data[newName] = {label: newLabel};
    $scope.newLabel = $scope.newName = "";
  };

  $scope.removeField = function(fieldName) {
    delete($scope.field.properties[fieldName]);
    delete($scope.data[fieldName]);
  };

  $scope.editField = function(fieldName) {
    $scope.editfield = $scope.field.properties[fieldName];
    $scope.editfieldOptions = $scope.data[fieldName];
  };
})

.controller('coreObjectController', function($scope) {
  $scope.addField = function() {
    console.log($scope.data[$scope.name]);
    if($scope.data[$scope.name] === undefined) {
      $scope.data[$scope.name] = {};
    }
    $scope.data[$scope.name][$scope.newField] = $scope.newValue;
    $scope.newField = $scope.newValue = "";
  };

  $scope.removeField = function(name, key) {
    delete($scope.data[name][key]);
  };

  $scope.$watch('data', function() {
    if($scope.data !== undefined && $scope.schema !== undefined) {
      if($scope.schema.type === 'object') {
        for(var property in $scope.schema.properties) {
          if($scope.data[property] === undefined) {
            if($scope.schema.properties[property].type === 'object') {
              $scope.data[property] = {};  
            }
            if($scope.schema.properties[property].type === 'array') {
              $scope.data[property] = [];
            }
          }
        }
      }
    }
  });
})

.controller('coreSelectController', function($scope) {
  $scope.switch = function(data) {
    $scope.$parent.data = data;
  };
})

.controller('coreGlobalSelectController', function($scope) {
  $scope.switch = function(data) {
    $scope.$parent.data.value = data;
  };
})

.run(function(FieldConfig) {
  new FieldConfig({type: 'string'})
  .addWidget('standard', {template: "forms/fields/textfield.tpl.html", config: "forms/fields/textfield.config.tpl.html"})
  .addWidget('select', {template: "forms/fields/select.tpl.html", config: "forms/fields/textfield.config.tpl.html"})
  .addWidget('textarea', {template: "forms/fields/textarea.tpl.html", config: "forms/fields/textarea.config.tpl.html"}).save();
  new FieldConfig({type: 'integer'})
  .addWidget('standard', {template: "forms/fields/integer.tpl.html", config: "forms/fields/integer.config.tpl.html"}).save();
  new FieldConfig({type: 'boolean'})
  .addWidget('standard', {template: "forms/fields/boolean.tpl.html", config: "forms/fields/boolean.config.tpl.html"}).save();
  new FieldConfig({type: 'object'})
  .addWidget('standard', {template: "forms/fields/object.tpl.html", config: "forms/fields/object.config.tpl.html"})
  .addWidget('select_with_global', {template: "forms/fields/select_with_global.tpl.html", config: "forms/fields/textfield.config.tpl.html"})
    .addWidget('textfield_with_global', {template: "forms/fields/textfield_with_global.tpl.html", config: "forms/fields/textfield.config.tpl.html"}).save();
  new FieldConfig({type: 'array'})
  .addWidget('standard', {template: "forms/fields/array.tpl.html", config: "forms/fields/array.config.tpl.html"}).save();
  new FieldConfig({type: 'null'})
  .addWidget('standard', {template: "forms/fields/null.tpl.html", config: "forms/fields/null.config.tpl.html"}).save();
})

;

