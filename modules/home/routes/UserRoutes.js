'use strict';

/**
 * Module dependencies.
 */

var user = require('../controllers/UserController.js');

module.exports = function(app) {
  app.route('/user')
    .get(user.index);

  //app.route('/test')
  //  .get(index.test);
    //.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
  // Finish by binding the article middleware
  //app.param('articleId', articles.articleByID);
};
