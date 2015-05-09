'use strict';

var nodeCtrl = require('../controllers/NodeController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/website/:link/node')
    .all(authUtil.requireUserAuth)
    .all(nodeCtrl.findWebsite)
    .get(nodeCtrl.list)
    .post(nodeCtrl.create);

}
