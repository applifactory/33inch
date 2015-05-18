'use strict';

var index = require('../controllers/IndexController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.all('/app', index.index)
  app.all('/app/*', index.index)
  app.all('/account', index.index)
  app.all('/account/*', index.index)
  app.all('/logout', index.index)
  app.all('/components/list', index.list)

    //.all(authUtil.requireUserAuth)


    //.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
  // Finish by binding the article middleware
  //app.param('articleId', articles.articleByID);
};
