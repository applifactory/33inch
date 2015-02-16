var express    = require('express'); // call express
var authRouter = require('./AuthRouter');
//var mongoose = require('mongoose')
//var Video = require('../models/user');

module.exports.controller = function(app) {
  var router = express.Router();
  authRouter(router);
  router.route('/')
    .get(function(req, res){
      res.json({a:1});
    });
  app.use('/api/index', router);
}
