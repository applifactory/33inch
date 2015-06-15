'use strict';

var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });

module.exports.processImage = function(file, callback) {
  var fileName = file.originalFilename.replace(/(.+)\.([\w\d]+)/gi, '$1').replace(/([\W])/g, '');
  var fileExt = file.originalFilename.replace(/(.+)\.([\w\d]+)/gi, '$2');
  if ( fileName == fileExt )
    fileExt = null;
  fileName += Date.now();
  fs.readFile(file.path, function (err, data) {
    if ( err ) callback(false);
    if ( !fs.existsSync('public/fx/') ) fs.mkdirSync('public/fx/');
    var newPath = 'public/fx/' + fileName + ( fileExt ? '.' + fileExt : '' );
    fs.writeFile(newPath, data, function (err) {
      if ( err ) callback(false);
      gm(newPath).resize(1100, 1100, '>').write('public/fx/l-' + fileName + ( fileExt ? '.' + fileExt : '' ), function(err){
        if ( err ) callback(false);
        gm(newPath).resize(800, 800, '>').write('public/fx/m-' + fileName + ( fileExt ? '.' + fileExt : '' ), function(err){
          if ( err ) callback(false);
          gm(newPath).resize(400, 400, '>').write('public/fx/s-' + fileName + ( fileExt ? '.' + fileExt : '' ), function(err){
            if ( err ) callback(false);
            gm(newPath).gravity('Center').resize(600, 600, "^").crop(600, 600).write('public/fx/sqare-' + fileName + ( fileExt ? '.' + fileExt : '' ), function(err){
              if ( err ) callback(false);
              gm(newPath).gravity('Center').resize(720, 480, "^").crop(720, 480).write('public/fx/c-' + fileName + ( fileExt ? '.' + fileExt : '' ), function(err){
                if ( err ) callback(false);
                callback(fileName + ( fileExt ? '.' + fileExt : '' ));
              });
            });
          });
        });
      });
    });
  });
}

module.exports.deleteImage = function(file, callback) {
  if ( fs.existsSync( 'public/fx/' + file ) ) {
    fs.unlink('public/fx/' + file, function(){});
    fs.unlink('public/fx/l-' + file, function(){});
    fs.unlink('public/fx/m-' + file, function(){});
    fs.unlink('public/fx/s-' + file, function(){});
    fs.unlink('public/fx/xs-' + file, function(){});
    fs.unlink('public/fx/sqare-' + file, function(){});
    fs.unlink('public/fx/c-' + file, function(){});
    callback(true);
  } else {
    callback(false);
  }
}

module.exports.processFile = function(file, callback) {
  var fileName = file.originalFilename.replace(/(.+)\.([\w\d]+)/gi, '$1').replace(/([\W])/g, '');
  var fileExt = file.originalFilename.replace(/(.+)\.([\w\d]+)/gi, '$2');
  if ( fileName == fileExt )
    fileExt = null;
  fileName += Date.now();
  fs.readFile(file.path, function (err, data) {
    if ( err ) callback(false);
    if ( !fs.existsSync('public/fx/') ) fs.mkdirSync('public/fx/');
    var newPath = 'public/fx/' + fileName + ( fileExt ? '.' + fileExt : '' );
    fs.writeFile(newPath, data, function (err) {
      if ( err ) callback(false);
      callback(fileName + ( fileExt ? '.' + fileExt : '' ));
    });
  });
}

module.exports.deleteFile = function(file, callback) {
  if ( fs.existsSync( 'public/fx/' + file ) ) {
    fs.unlink('public/fx/' + file, function(){});
    callback(true);
  } else {
    callback(false);
  }
}
