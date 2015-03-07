//var express    = require('express'); // call express
//var mongoose = require('mongoose')
//var Video = require('../models/user');

var _views = 'home/views/index/';

module.exports.index = function(req, res) {
  res.render(_views+'index');
};

module.exports.test = function(req, res) {
  res.render(_views+'test');
};
