app.service('Inch33ElementService', function(){
  return {
    config: {
      'header-straight': {
        elements: [
          {
            name: 'Title',
            type: 'text',
            selector: '.hero h1',
            elements: true,
            //appearance: true
          },
          {
            name: 'Claim',
            type: 'text',
            selector: '.hero h2',
            elements: true,
            //appearance: true
          }
        ]
      },
      'article-text': {
        style: {
          backgroundColor: '#ffffff'
        },
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
        style: {
          backgroundColor: '#F5F5F5'
        },
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
            name: 'Claim',
            type: 'text',
            selector: '.container .regular',
            elements: false
          },
          {
            name: 'Item title',
            type: 'text',
            selector: '.container li h3',
            elements: true,
            column: true
          },
          {
            name: 'Item text',
            type: 'text',
            selector: '.container li p',
            elements: true,
            column: true
          }
        ]
      },
      'showcase-grid': {
        background: false,
        style: {
          backgroundColor: '#1D262D'
        },
        columns: {
          min: 2,
          max: 6,
          default: 3
        },
        elements: [
          {
            name: 'Title',
            type: 'text',
            selector: 'li h3',
            column: true
          },
          {
            name: 'Background',
            type: 'background',
            selector: 'ul li',
            column: true
          }
        ]
      },
      'list-grid': {
        style: {
          backgroundColor: '#C0A85A'
        },
        columns: {
          min: 1,
          max: 4,
          default: 2
        },
        elements: [
          {
            name: 'Title',
            type: 'text',
            selector: '.container li h3',
            elements: true,
            column: true
          },
          {
            name: 'Text',
            type: 'text',
            selector: '.container li p',
            elements: true,
            column: true
          }
        ]
      },
      'menu-default': {

      },
      'pricing-default': {
        elements: [
          {
            name: 'Title',
            type: 'text',
            selector: 'h1',
            elements: false
          },
          {
            name: 'Claim',
            type: 'text',
            selector: '.regular',
            elements: true
          },
          {
            name: 'Items',
            type: 'text',
            selector: '.table .items p'
          },
          {
            name: 'Prices',
            type: 'text',
            selector: '.table .prices p'
          },
          {
            name: 'Sub-text',
            type: 'text',
            selector: 'p.small',
            elements: true
          }
        ]
      }
    },
    colors: ['#ffffff', '#F5F5F5', '#1D262D', '#C0A85A', '#3a4553'],
    registerColor: function(color) {
      if ( this.colors.indexOf(color) < 0 )
        this.colors.push(color);
    },
    getConfig: function(type) {
      return this.config.hasOwnProperty(type) ? this.config[type] : {};
    }
  }
});
