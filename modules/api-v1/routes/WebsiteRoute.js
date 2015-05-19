'use strict';

var websiteCtrl = require('../controllers/WebsiteController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/website')
    .all(authUtil.requireUserAuth)
    .get(websiteCtrl.index)
    .post(websiteCtrl.create);
  app.route('/api/v1/website/:link')
    .all(authUtil.requireUserAuth)
    .get(websiteCtrl.details);
  app.route('/api/v1/website/:link/export')
    .all(authUtil.requireUserAuth)
    .get(websiteCtrl.export);
}
