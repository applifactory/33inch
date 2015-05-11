app.factory('HttpTokenInterceptor', function($window) {
  return {
    request: function(config) {
      if ( $window.localStorage.authToken )
        config.headers['X-Auth-Token'] = $window.localStorage.authToken;
      return config;
    }
  };
});
