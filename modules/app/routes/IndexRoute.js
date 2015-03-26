'use strict';

var index = require('../controllers/IndexController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/app')
    .all(authUtil.requireUserAuth)
    .get(index.index);

    //.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
  // Finish by binding the article middleware
  //app.param('articleId', articles.articleByID);
};
