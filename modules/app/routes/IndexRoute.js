var index = require('../controllers/IndexController.js'),
    authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.all('/preview/:link', index.websitePreview);
  app.all('/components/list', index.list);
  app.all(/\/.+$/, index.index);
};
