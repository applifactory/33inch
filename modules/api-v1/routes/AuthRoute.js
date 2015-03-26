'use strict';

var authCtrl = require('../controllers/AuthController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/auth')
    .get(authCtrl.index)
    .post(authCtrl.login);
}
