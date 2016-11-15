app.service('UserService', function($http, $q, SettingsService, $window, $timeout){
  return {
    get: function(userId) {
      var deferred = $q.defer();
      $http.get(SettingsService.apiUrl + 'user/' + userId).success(function(result){
        deferred.resolve(result);
      }).error(function(error, status){
        deferred.reject();
      });
      return deferred.promise;
    },
    update: function(userId, update) {
      var deferred = $q.defer();
      var _self = this;
      $http.put(SettingsService.apiUrl + 'user/' + userId, update).success(function(data){
        deferred.resolve(data);
      }).error(function(error, status){
        deferred.reject(error, status);
      });
      return deferred.promise;
    },
    changePassword: function(userId, currentPassword, newPassword) {
      var deferred = $q.defer();
      var _self = this;
      $http.put(SettingsService.apiUrl + 'user/' + userId + '/password', {
        currentPassword: currentPassword,
        newPassword: newPassword
      }).success(function(data){
        deferred.resolve(data);
      }).error(function(error, status){
        deferred.reject(error, status);
      });
      return deferred.promise;
    }
  };
});
