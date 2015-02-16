module.exports = function(router) {
  router.use(function(req, res, next) {
    var token = req.body.token || req.param['token'] || req.headers['x-access-token'];
    //if ( token )
    res.json({a: 5});
    //if ( )
    //next();
  });
}
