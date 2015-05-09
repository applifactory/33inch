app.service('Diff', function(){
  return {
    getChanges: function(template, override) {
      var self = this;
      var ret = {};
      for (var name in template) {
        if (name in override) {
          if (_.isObject(override[name]) && !_.isArray(override[name])) {
            var diff = self.getChanges(template[name], override[name]);
            if (!_.isEmpty(diff)) {
              ret[name] = diff;
            }
          } else if (!_.isEqual(template[name], override[name])) {
            ret[name] = override[name];
          }
        }
      }
      for (var name in override) {
        if ( !template.hasOwnProperty(name) )
          ret[name] = override[name];
      }
      return ret;
    },
    applyChanges: function(a, b) {
      console.error('Diff.applyChanges: not implemented');
    }
  }
})
