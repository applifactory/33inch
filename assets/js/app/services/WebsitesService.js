app.service('WebsitesService', function($http, $state, $q, SettingsService, AuthService){
  return {
    currentWebsite: null,
    getAll: function() {
      var deferred = $q.defer();
      $http.get(SettingsService.apiUrl + 'website').success(function(data){
        deferred.resolve(data);
      }).error(function(data, status){
        if ( status == 401 ) {
          AuthService.signOut().then(function(){
            $state.go('sign-in');
          });
        }
        deferred.reject(status);
      });
      return deferred.promise;
    },
    get: function(link) {
      var deferred = $q.defer();
      var _self = this;
      $http.get(SettingsService.apiUrl + 'website/' + link).success(function(data){
        _self.currentWebsite = data;
        deferred.resolve(data);
      }).error(function(data, status){
        _self.currentWebsite = null;
        if ( status == 401 ) {
          AuthService.signOut().then(function(){
            $state.go('sign-in');
          });
        }
        if ( status == 404 || status == 400 ) {
          $state.go('app');
        }
        deferred.reject(status);
      });
      return deferred.promise;
    },
    update: function(link, update) {
      var deferred = $q.defer();
      var _self = this;
      $http.put(SettingsService.apiUrl + 'website/' + link, update).success(function(data){
        deferred.resolve(data);
      }).error(function(error, status){
        deferred.reject(error, status);
      });
      return deferred.promise;
    },
    export: function(link, domain) {
      var deferred = $q.defer();
      var data = {};
      if ( domain )
        data.domain = domain;
      $http.put(SettingsService.apiUrl + 'website/' + link + '/export', data).success(function(){
        deferred.resolve();
      }).error(function(data, status){
        deferred.reject(data);
      });
      return deferred.promise;
    },
    share: function(link, email) {
      var deferred = $q.defer();
      var _self = this;
      $http.put(SettingsService.apiUrl + 'website/' + link + '/shares', { email: email }).success(function(data){
        deferred.resolve(data);
      }).error(function(error, status) {
        deferred.reject(error, status);
      });
      return deferred.promise;
    },
    getShares: function(link) {
      var deferred = $q.defer();
      var _self = this;
      $http.get(SettingsService.apiUrl + 'website/' + link + '/shares').success(function(data){
        deferred.resolve(data);
      }).error(function(error, status){
        deferred.reject(error, status);
      });
      return deferred.promise;
    },
    deleteShare: function(link, share) {
      var deferred = $q.defer();
      $http.delete(SettingsService.apiUrl + 'website/' + link + '/shares/' + share._id).success(function(){
        deferred.resolve();
      }).error(function(){
        deferred.reject();
      });
      return deferred.promise;
    }
  };
});
