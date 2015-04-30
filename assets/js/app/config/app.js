var app = angular.module('App33Inch', ['ngMessages', 'ui.router', 'ui.slider', 'theaquaNg']).run(function(){

})

app.config(function($httpProvider) {
  $httpProvider.interceptors.push('HttpTokenInterceptor');
});

