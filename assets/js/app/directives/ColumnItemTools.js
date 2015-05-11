app.directive("columnItemTools", function($timeout, $window, $compile, SettingsService, ElementsService) {
  return {
    restrict: "A",
    scope: false,
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          var tools = iElement[0].querySelector('.tools');
          if ( !tools ) {
            tools = document.createElement('div');
            tools.classList.add('tools');
            iElement[0].appendChild(tools);
            $compile(tools)(scope);
          }
          var button = document.createElement('div');
          button.classList.add('btn');
          button.innerHTML = '<i class="fa fa-times"></i>';
          tools.appendChild(button);
          $compile(button)(scope);
          angular.element(button).bind('click', function(){
            var index = -1;
            angular.forEach(scope.$parent.ngModel.data.columns, function(column, _index){
              if( scope.column == column )
                index = _index;
            });
            if ( index >= 0 )
              scope.$apply(function(){
                scope.$parent.ngModel.data.columns.splice(index, 1);
              });
          });
        }
      }
    }
  };
});
