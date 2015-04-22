var app = angular.module('App33Inch', ['ngMessages', 'ui.router']).run(function(){

})

app.config(function($httpProvider) {
  $httpProvider.interceptors.push('HttpTokenInterceptor');
});

