'use strict';

var index = require('../controllers/IndexController.js');
var authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.all(/\/.+$/, index.index)
  app.all('/components/list', index.list)
};
