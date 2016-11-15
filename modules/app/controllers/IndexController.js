var _views = 'app/views/index/',
    fs = require('fs');

module.exports.index = function(req, res) {
  res.render(_views+'index');
};

module.exports.list = function(req, res) {
  res.render(_views+'list');
};

module.exports.websitePreview = function(req, res) {
  var websitePath = 'build/' + req.params.link.replace('.jpg', ''),
      previewExists = fs.existsSync(websitePath + '/preview.jpg');

  if ( req.params.link.indexOf('.jpg') > 0 ) {
    if ( previewExists ) {
      return res.sendFile('preview.jpg', {root: websitePath});
    } else {
      res.status(404).end();
    }
  } else {
    if ( previewExists ) {
      res.send('<img src="/preview/' + req.params.link + '.jpg" />');
    } else {
      res.send('');
    }
  }
};
