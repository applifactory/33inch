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
      })
      return deferred.promise;
    },
    getWebsite: function(link) {
      var deferred = $q.defer();
      var _self = this
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
      })
      return deferred.promise;
    },
    exportWebsite: function(link, domain) {
      var deferred = $q.defer();
      var data = {};
      if ( domain )
        data.domain = domain;
      $http.put(SettingsService.apiUrl + 'website/' + link + '/export', data).success(function(){
        deferred.resolve();
      }).error(function(data, status){
        deferred.reject(data);
      })
      return deferred.promise;
    }
  }
})
