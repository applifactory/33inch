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
    },
    deleteFile: function(link, elementId, file) {
      console.log('deleteFile');
      var deferred = $q.defer();
      $http.delete(SettingsService.apiUrl + 'website/' + link + '/element/' + elementId + '/file/' + file).success(function(node){
        deferred.resolve();
      }).error(function(){
        deferred.reject();
      })
      return deferred.promise;
    },
    moveUp: function(link, elementId, collection) {
      var index = -1;
      angular.forEach(collection, function(_el, _index){
        if ( _el._id == elementId )
          index = _index;
      });
      if ( index > 0 ) {
        collection.move(index, index-1);
        this.updatePositions(link, collection);
      }
    },
    moveDown: function(link, elementId, collection) {
      var index = -1;
      angular.forEach(collection, function(_el, _index){
        if ( _el._id == elementId )
          index = _index;
      });
      if ( index < collection.length-1 ) {
        collection.move(index, index+1);
        this.updatePositions(link, collection);
      }
    },
    updatePositions: function(link, collection) {
      var _ids = [];
      angular.forEach(collection, function(_element){
        _ids.push(_element._id);
      });
      var deferred = $q.defer();
      $http.put(SettingsService.apiUrl + 'website/' + link + '/element/positions', {ids: _ids}).success(function(){
        deferred.resolve();
      }).error(function(){
        deferred.reject();
      })
      return deferred.promise;
    }
  }
});
