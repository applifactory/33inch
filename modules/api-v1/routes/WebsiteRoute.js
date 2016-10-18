var websiteCtrl = require('../controllers/WebsiteController.js'),
    authUtil = require('../../../utils/AuthService.js');

module.exports = function(app) {
  app.route('/api/v1/website')
    .all(authUtil.requireUserAuth)
    .get(websiteCtrl.index)
    .post(websiteCtrl.create);
  app.route('/api/v1/website/:link')
    .all(authUtil.requireUserAuth)
    .get(websiteCtrl.details)
    .put(websiteCtrl.update);
  app.route('/api/v1/website/:link/export')
    .all(authUtil.requireUserAuth)
    .put(websiteCtrl.export);
  app.route('/api/v1/mail').
    post(websiteCtrl.sendMail);
};
