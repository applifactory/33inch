var userCtrl = require('../controllers/UserController.js'),
    authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/user')
    .post(userCtrl.register);
  app.route('/api/v1/user/:id')
    .all(authUtil.requireUserAuth)
    .get(userCtrl.find)
    .put(userCtrl.update);
};
