var authService = require('../../../utils/AuthService.js');

module.exports.register = function(req, res) {

  var login = req.body.email,
      password = req.body.password;

  authService.registerUser(login, password, function(error){
    if ( error ) {
      res.status(403).json({message: error});
    } else {
      authService.loginUser(login, password, false, function(token){
        if ( token )
          res.json({message: 'Register success', token: token});
        else
          res.status(403).json({message: 'Something went really wrong'});
      });
    }
  });

};
