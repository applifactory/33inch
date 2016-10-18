app.component('switch', {
  template: '<div class="switch" ng-click="$ctrl.click()" ng-class="{on: $ctrl.state}"><handle></ handle></div>',
  bindings: {
    state: '=ngModel',
    callback: '&onChange',
    disabled: '=disabled'
  },
  controller: function($scope){
    this.click =  function(){
      if (this.disabled === undefined || !this.disabled) {
        this.state = !this.state;
        if ( this.callback ) {
          this.callback({state: this.state});
        }
      }
    };
  }
});
