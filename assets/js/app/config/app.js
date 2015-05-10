var app = angular.module('App33Inch', ['ngMessages', 'ui.router', 'ui.slider', 'theaquaNg', 'lr.upload']).run(function(){

})

app.config(function($httpProvider) {
  $httpProvider.interceptors.push('HttpTokenInterceptor');
});

