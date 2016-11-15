var authService = require('../../../utils/AuthService.js'),
    extractObject = require('../../../utils/ExtractObject'),
    User = require('../../../models/user');

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
