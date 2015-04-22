'use strict';

var jwt = require('jsonwebtoken');
var validator = require('validator');
var config = require('../config/config.js');
var User = require('../models/user');

module.exports.requireUserAuth = function(req, res, next) {
  var token = req.header('X-Auth-Token');
  if ( token )
    jwt.verify(token, config.secret, function(err, decoded) {
      if ( decoded ) {
        if ( decoded.roles && decoded.roles.indexOf('user') >= 0 ) {
          req.params.authUser = decoded;
          return next();
        }
      }
      res.status(401).end();
    });
  else
    res.status(401).end();
};

module.exports.requireAdminAuth = function(req, res, next) {
  var token = req.header('X-Auth-Token');
  if ( token )
    jwt.verify(token, config.secret, function(err, decoded) {
      if ( decoded ) {
        if ( decoded.roles && decoded.roles.indexOf('admin') >= 0 ) {
          req.params.authUser = decoded;
          return next();
        }
      }
      res.status(401).end();
    });
  else
    res.status(401).end();
};

module.exports.loginUser = function(login, password, stayLogged, callback) {
  User.findOne({email: login}).select('name email password roles').exec(function(err, user){
    console.log(login, password, stayLogged);
    if ( !user || !user.comparePassword(password) ) {
      callback(false);
    } else {
      callback(
        jwt.sign({
          userId: user._id,
          roles: user.roles
        }, config.secret, { expiresInMinutes: 60 * 24 * ( stayLogged ? 356 : 3 ) }),
        user
      );
    }
  });
}

module.exports.registerUser = function(email, password, callback) {
  if ( !email )
    return callback( 'Please type in your email' );
  if ( !validator.isEmail(email) )
    return callback( 'Wrong email format' );
  if ( !validator.isLength(password, 6) )
    return callback( 'Password must have at least 6 characters' );
  var user = new User();
  user.email = email;
  user.password = password;
  user.roles.push('user');
  user.save(function(error){
    if ( error ) {
      var errorMessage = '';
      switch ( error.code ) {
        case 11000:
          errorMessage = 'User with this email already exists'
          break;
        default:
          errorMessage = 'User registration failed'
      }
      callback(errorMessage);
    } else
      callback(null);
  });
}
