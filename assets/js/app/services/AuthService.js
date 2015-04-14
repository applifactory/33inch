app.service('AuthService', function($http, $q, SettingsService, $window){
  return {
    signIn: function(login, password) {
      var deferred = $q.defer();
      $http.post(SettingsService.apiUrl + 'auth', {
        login: login,
        password: password
      }).success(function(result){
        deferred.resolve(result.token);
        $window.localStorage.authToken = result.token;
      }).error(function(error){
        deferred.reject(error.message);
      });
      return deferred.promise;
    }
  }
});
