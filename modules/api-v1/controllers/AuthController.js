var authUtil = require('../../../utils/AuthService.js');
var User = require('../../../models/user');

module.exports.index = function(req, res) {
  res.json({user: req.params.authUser});
};

module.exports.login = function(req, res) {
  authUtil.loginUser( req.body.login, req.body.password, req.body.stayLogged, function(token, user){
    if ( token ) {
      res
        .json({
          message: 'Login success',
          token: token
        });
    } else {
      res
        .status(401)
        .json({
          message: 'Wrong email or password'
        });
    }
  });
};
