app.service('Inch33ElementService', function(){
  return {
    getConfig: function(type) {
      switch (type) {
        case 'article-text':
          return {
            texts: [
              {
                selector: '.container h1',
                style: 'h1'
              }, {
                selector: '.container .claim',
                style: 'claim'
              }, {
                selector: '.container .regular',
                style: 'p'
              }
            ]
          }
          break;
        default:
          return {};
      }
    }
  }
});
