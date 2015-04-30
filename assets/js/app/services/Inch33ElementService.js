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
      },
      'article-features': {
        background: true,
        columns: {
          min: 2,
          max: 5,
          default: 3
        },
        elements: [
          {
            name: 'Title',
            type: 'text',
            selector: '.container h1',
            elements: true
          },
          {
            name: 'Text',
            type: 'text',
            selector: '.container .regular',
            elements: false
          }
        ]
      },
      'showcase-grid': {
        background: false,
        columns: {
          min: 2,
          max: 6,
          default: 3
        }
      },
      'list-grid': {
        background: true,
        columns: {
          min: 1,
          max: 4,
          default: 2
        }
      }
    },
    getConfig: function(type) {
      return this.config.hasOwnProperty(type) ? this.config[type] : {};
    }
  }
});
