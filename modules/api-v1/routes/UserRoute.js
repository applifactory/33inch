'use strict';

var userCtrl = require('../controllers/UserController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/user')
    //.get(authCtrl.index)
    .post(userCtrl.register);
}
