app.service('ElementsService', function($http, $q, SettingsService) {
  return {
    createElement: function(template, link, nodeId) {
      var deferred = $q.defer();
      $http.post(SettingsService.apiUrl + 'website/' + link + '/node/' + nodeId + '/element', {template: template}).success(function(node){
        deferred.resolve(node);
      }).error(function(){
        deferred.reject();
      });
      return deferred.promise;
    },
    createBaseElement: function(template, link) {
      var deferred = $q.defer();
      $http.post(SettingsService.apiUrl + 'website/' + link + '/element', {template: template}).success(function(node){
        deferred.resolve(node);
      }).error(function(){
        deferred.reject();
      });
      return deferred.promise;
    },
    deleteElement: function(link, elementId) {
      var deferred = $q.defer();
      $http.delete(SettingsService.apiUrl + 'website/' + link + '/element/' + elementId).success(function(){
        deferred.resolve();
      }).error(function(){
        deferred.reject();
      });
      return deferred.promise;
    },
    update: function(link, elementId, element) {
      var deferred = $q.defer();
      $http.put(SettingsService.apiUrl + 'website/' + link + '/element/' + elementId, element).success(function(node){
        deferred.resolve(node);
      }).error(function(){
        deferred.reject();
      });
      return deferred.promise;
    },
    deleteImage: function(link, elementId, image) {
      var deferred = $q.defer();
      $http.delete(SettingsService.apiUrl + 'website/' + link + '/element/' + elementId + '/image/' + image).success(function(node){
        deferred.resolve();
      }).error(function(){
        deferred.reject();
      });
      return deferred.promise;
    },
    deleteFile: function(link, elementId, file) {
      var deferred = $q.defer();
      $http.delete(SettingsService.apiUrl + 'website/' + link + '/element/' + elementId + '/file/' + file).success(function(node){
        deferred.resolve();
      }).error(function(){
        deferred.reject();
      });
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
      });
      return deferred.promise;
    }
  };
});
