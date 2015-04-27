var authUtil = require('../../../utils/AuthService.js');
var User = require('../../../models/user');
var Website = require('../../../models/website');

module.exports.index = function(req, res) {
  Website.find({ owner: req.params.authUser.userId })
    .exec(function(err, websites){
      if (err) return res.status(401).end();
      res.json({
        websites: websites
      });
    });
};

module.exports.create = function(req, res) {
  if ( req.body.name ) {
    var userId = req.params.authUser.userId;
    var website = new Website();
    website.name = req.body.name;
    website.permalink = ( req.body.permalink ? req.body.permalink : website.name ).replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
    if ( req.body.domain )  website.domain = req.body.domain;
    website.owner = userId;
    website.save(function(error){
      if ( error ) {
        var errMessage = 'Unknown error';
        if ( error.code == 11000 ) {
          if ( error.err.indexOf('permalink') > 0 )
            errMessage = 'Link already taken';
        } else if ( error.message )
          errMessage = error.message;
        res.status(403).json({message: errMessage});
      } else
        res.json({message: 'Website created'});
    });
  } else
    res.status(400);
}
