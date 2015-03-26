//var express    = require('express'); // call express
//var mongoose = require('mongoose')
//var Video = require('../models/user');

var _views = 'home/views/user/';

module.exports.index = function(req, res) {
  res.render(_views+'index');
};
