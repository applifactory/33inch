'use strict';

var nodeCtrl = require('../controllers/NodeController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/website/:link/node')
    .all(authUtil.requireUserAuth)
    .all(nodeCtrl.findWebsite)
    .get(nodeCtrl.list)
    .post(nodeCtrl.create);

  app.route('/api/v1/website/:link/node/positions')
    .all(authUtil.requireUserAuth)
    .all(nodeCtrl.findWebsite)
    .put(nodeCtrl.updatePositions);

  app.route('/api/v1/website/:link/node/:nodeId')
    .all(authUtil.requireUserAuth)
    .all(nodeCtrl.findWebsite)
    .get(nodeCtrl.details)
    .put(nodeCtrl.update)
    .delete(nodeCtrl.delete);

}
