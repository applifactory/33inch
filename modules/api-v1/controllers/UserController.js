var authService = require('../../../utils/AuthService.js'),
    extractObject = require('../../../utils/ExtractObject'),
    User = require('../../../models/user'),
    validator = require('validator');

module.exports.register = function(req, res) {

  var login = req.body.email,
      password = req.body.password;

  authService.registerUser(login, password, function(error){
    if ( error ) {
      res.status(400).json({message: error});
    } else {
      authService.loginUser(login, password, false, function(token){
        if ( token )
          res.json({message: 'Register success', token: token});
        else
          res.status(400).json({message: 'Something went really wrong'});
      });
    }
  });

};

module.exports.find = function(req, res) {
  if ( req.params.id == req.params.authUser._id ) {
    res.json({user: req.params.authUser});
  } else {
    res.status(403).end();
  }
};


module.exports.update = function(req, res) {
  if ( req.params.id == req.params.authUser._id ) {
    var update = extractObject(req.body, [
      'name',
      'surname'
    ]);
    User.update({ _id: req.params.id }, update, function(err) {
      if ( err ) {
        return res.status(400).json({ message: err }).end();
      }
      res.end();
    });
  } else {
    res.status(403).end();
  }
};

module.exports.changePassword = function(req, res) {
  if ( req.params.id == req.params.authUser._id ) {
    if ( !req.body.currentPassword || !req.body.newPassword ) {
      return res.status(400).end();
    }
    var currentPassword = req.body.currentPassword,
        newPassword = req.body.newPassword;

    User.findOne({_id: req.params.id}).select('password').exec(function(err, user){
      if ( err || !user ) {
        return res.status(400).end();
      }
      if ( !user.comparePassword(currentPassword) ) {
        return res.status(400).json({message: 'Current password doesn\'t match'}).end();
      }
      if ( !validator.isLength(newPassword, 6) ) {
        return res.status(400).json({message: 'Password must have at least 6 characters'}).end();
      }
      user.password = newPassword;
      user.save(function(err) {
        if ( err ) {
          return res.status(400).json({message: 'Something went wrong'}).end();
        } else {
          res.end();
        }
      });
    });
  } else {
    res.status(403).end();
  }
};
