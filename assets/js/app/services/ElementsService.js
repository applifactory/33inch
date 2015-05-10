app.service('ElementsService', function($http, $q, SettingsService) {
  return {
    updateData: function(link, elementId, data) {
      var deferred = $q.defer();
      $http.put(SettingsService.apiUrl + 'website/' + link + '/element/' + elementId, {data: data}).success(function(node){
        deferred.resolve(node);
      }).error(function(){
        deferred.reject();
      })
      return deferred.promise;
    },
    deleteImage: function(link, elementId, image) {
      console.log('deleteImage');
      var deferred = $q.defer();
      $http.delete(SettingsService.apiUrl + 'website/' + link + '/element/' + elementId + '/image/' + image).success(function(node){
        deferred.resolve();
      }).error(function(){
        deferred.reject();
      })
      return deferred.promise;
    }
  }
});
