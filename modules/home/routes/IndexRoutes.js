'use strict';

/**
 * Module dependencies.
 */

var index = require('../controllers/IndexController.js');

module.exports = function(app) {
  app.route('/')
    .get(index.index);

  app.route('/test')
    .get(index.test);
    //.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
  // Finish by binding the article middleware
  //app.param('articleId', articles.articleByID);
};
