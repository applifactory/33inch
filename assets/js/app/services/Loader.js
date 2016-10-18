app.service('Loader', function() {
  return {
    show: function(message) {
      if ( this.loader ) {
        this.message.innerHTML = message;
      } else {
        this.loader = document.createElement('div');
        this.loader.classList.add('loading');
        this.message = document.createElement('div');
        this.message.classList.add('message');
        this.loader.appendChild(this.message);
        document.body.appendChild(this.loader);
        this.message.innerHTML = message;
      }
    },
    hide: function() {
      if ( this.loader ) {
        this.loader.remove();
        this.loader = null;
      }
    }
  };
});
