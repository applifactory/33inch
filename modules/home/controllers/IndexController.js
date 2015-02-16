var express    = require('express'); // call express
//var mongoose = require('mongoose')
//var Video = require('../models/user');

var _views = 'home/views/index/';

module.exports.controller = function(app) {
  var homeRouter = express.Router();
  homeRouter.route('/')
    .get(function(req, res){
      res.render(_views+'index');
    });
  homeRouter.route('/test')
    .get(function(req, res){
      res.render(_views+'test');
    })
  app.use('/', homeRouter);
}
