'use strict';

var jwt = require('jsonwebtoken');
var validator = require('validator');
var config = require('../config/config.js');
var User = require('../models/user');

module.exports.requireUserAuth = function(req, res, next) {
  console.log('# requireUserAuth');
  res.redirect('/account');
//  next();
};

module.exports.requireAdminAuth = function(req, res, next) {
  console.log('# requireAdminAuth');
  next();
};

module.exports.loginUser = function(login, password, callback) {
  User.findOne({email: login}).select('name email password').exec(function(err, user){
    console.log(login, password);
    if ( !user || !user.comparePassword(password) ) {
      callback(false);
    } else {
      callback(
        jwt.sign({
          foo: 'bar'
        }, config.secret, { expiresInMinutes: 60 * 24 * 3 })
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
