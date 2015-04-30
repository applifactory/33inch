app.service('Inch33ElementService', function(){
  return {
    config: {
      'header-straight': {
        background: true,
        elements: [
          {
            name: 'Title',
            type: 'text',
            selector: '.hero h1',
            elements: true,
            appearance: true
          },
          {
            name: 'Claim',
            type: 'text',
            selector: '.hero h2',
            elements: true,
            appearance: true
          }
        ]
      },
      'article-text': {
        background: true,
        elements: [
          {
            name: 'Title',
            type: 'text',
            selector: '.container h1'
          },
          {
            name: 'Claim',
            type: 'text',
            selector: '.container .claim',
            elements: true
          },
          {
            name: 'Text',
            type: 'text',
            selector: '.container .regular',
            elements: false
          }
        ]
      }
    },
    getConfig: function(type) {
      return this.config.hasOwnProperty(type) ? this.config[type] : {};
    }
  }
});
