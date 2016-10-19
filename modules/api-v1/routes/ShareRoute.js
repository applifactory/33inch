var shareCtrl = require('../controllers/ShareController.js'),
    authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/website/:link/shares')
    .all(authUtil.requireUserAuth)
    .get(shareCtrl.list)
    .put(shareCtrl.add);
  app.route('/api/v1/website/:link/shares/:id')
    .all(authUtil.requireUserAuth)
    .delete(shareCtrl.delete);
};
