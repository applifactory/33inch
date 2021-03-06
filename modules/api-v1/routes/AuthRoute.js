var authCtrl = require('../controllers/AuthController.js'),
    authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/auth')
    .get(authUtil.requireUserAuth)
    .get(authCtrl.index)
    .post(authCtrl.login);
};
