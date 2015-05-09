'use strict';

var elementCtrl = require('../controllers/ElementController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/website/:link/node/:nodeId/element')
    .all(authUtil.requireUserAuth)
    .all(elementCtrl.findWebsite)
    //.get(elementCtrl.list)
    .post(elementCtrl.create);

}
