var authUtil = require('../../../utils/AuthService.js');
//var express    = require('express'); // call express
//var mongoose = require('mongoose')
//var Video = require('../models/user');

module.exports.index = function(req, res) {
  res.json({message: 'hello world'});
};

module.exports.login = function(req, res) {
  authUtil.loginUser( req.body.login, req.body.password, function(token){
    if ( token ) {
      res.json({message: 'Login success', token: token});
    } else {
      res.status(401).json({ message: 'Wrong email or password' });
    }
  });
};
