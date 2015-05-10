'use strict';

var elementCtrl = require('../controllers/ElementController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/website/:link/node/:nodeId/element')
    .all(authUtil.requireUserAuth)
    .all(elementCtrl.findWebsite)
    .post(elementCtrl.create);
  app.route('/api/v1/website/:link/element/:elementId')
    .all(authUtil.requireUserAuth)
    .all(elementCtrl.findWebsite)
    .put(elementCtrl.update);
  app.route('/api/v1/website/:link/element/:elementId/image')
    .all(authUtil.requireUserAuth)
    .all(elementCtrl.findWebsite)
    .post(elementCtrl.uploadImage);
  app.route('/api/v1/website/:link/element/:elementId/image/:image')
    .all(authUtil.requireUserAuth)
    .all(elementCtrl.findWebsite)
    .delete(elementCtrl.deleteImage);

}
