app.service('Inch33ElementService', function(){
  return {
    config: Inch33ElementsConfig,
    colors: ['#ffffff', '#1D262D', '#C0A85A', '#3a4553'],
    registerColor: function(color) {
      if ( this.colors.indexOf(color) < 0 )
        this.colors.push(color);
    },
    getConfig: function(type) {
      return this.config.hasOwnProperty(type) ? this.config[type] : {};
    }
  };
});
