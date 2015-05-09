app.service('NodesService', function($http, $state, $q, $timeout, SettingsService, AuthService){
  return {
    currentNodes: null,
    getNodes: function(link) {
      var deferred = $q.defer();
      var _self = this;
      $http.get(SettingsService.apiUrl + 'website/' + link + '/node').success(function(data){
        _self.currentNodes = data.nodes;
        deferred.resolve(data.nodes);
      }).error(function(data, status){
        _self.currentNodes = null;
        if ( status == 401 ) {
          AuthService.signOut().then(function(){
            $state.go('account');
          });
        }
        if ( status == 404 || status == 400 ) {
          $state.go('app');
        }
        deferred.reject(status);
      })
      return deferred.promise;
    },
    findPath: function(paramsPath, nodes) {
      var deferred = $q.defer();
      $timeout(function(){
        var path = [];

        //  search for home node
        var homeNode = null;
        angular.forEach(nodes, function(node){
          if ( node.link == '' )
            homeNode = node;
        });

        if ( paramsPath == '' ) {
          //  empty path means we're home
          path.push(homeNode);
        } else {
          //  building path of nodes
          var parts = paramsPath.substr(1).split('/');
          var _nodes = angular.copy(nodes);
          angular.forEach(parts, function(part){
            console.log('searching for', part);
            var _node = null;
            angular.forEach(_nodes, function(node){
              if ( node.link == part ) {
                _node = node;
              }
            });
            if ( !_node ) {
              //  didn't find base node, searching for home sub-node
              angular.forEach(homeNode.nodes, function(node){
                if ( node.link == part ) {
                  path.push(homeNode);
                  path.push(node);
                  _node = node;
                }
              });
            } else {
              //  node of 1st level found, searching deeper
              path.push(_node);
              _nodes = angular.copy(_node.nodes);
            }
          });
        }
        if ( parts.length > path.length )
          deferred.reject();
        else
          deferred.resolve(path);
      });
      return deferred.promise;
    }
  }
})