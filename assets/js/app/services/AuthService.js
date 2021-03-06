app.service('AuthService', function($http, $q, SettingsService, $window, $timeout){
  return {
    signIn: function(login, password, stayLogged) {
      var deferred = $q.defer();
      $http.post(SettingsService.apiUrl + 'auth', {
        login: login,
        password: password,
        stayLogged: stayLogged
      }).success(function(result){
        deferred.resolve(result.token);
        $window.localStorage.authToken = result.token;
      }).error(function(error){
        deferred.reject(error.message);
      });
      return deferred.promise;
    },
    signUp: function(email, password) {
      var deferred = $q.defer();
      $http.post(SettingsService.apiUrl + 'user', {
        email: email,
        password: password
      }).success(function(result){
        deferred.resolve(result.token);
        $window.localStorage.authToken = result.token;
      }).error(function(error){
        deferred.reject(error.message);
      });
      return deferred.promise;
    },
    signOut: function() {
      var deferred = $q.defer();
      $window.localStorage.removeItem('authToken');
      $timeout(function(){
        deferred.resolve();
      });
      return deferred.promise;
    },
    me: function() {
      var deferred = $q.defer();
      if ( $window.localStorage.authToken ) {
        $http.get(SettingsService.apiUrl + 'auth').success(function(result){
          deferred.resolve(result);
        }).error(function(error){
          $window.localStorage.removeItem('authToken');
          deferred.reject();
        });
      } else
        $timeout(function(){
          deferred.reject();
        });
      return deferred.promise;
    }
  };
});
