//var express    = require('express'); // call express
//var mongoose = require('mongoose')
//var Video = require('../models/user');

var _views = 'app/views/index/';

module.exports.index = function(req, res) {
  res.render(_views+'index');
};

module.exports.list = function(req, res) {
  res.render(_views+'list');
};
