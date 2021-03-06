var fs = require('fs-extra');
var async = require('async');
var jade = require('jade');
var Node = require('../models/node');
var WebsiteElementService = require('./WebsiteElementService');
var nodeCtrl = require('../modules/api-v1/controllers/NodeController.js');

var headers = '';
var footers = '';
var config = null;
var styles = '';
var attachements = [];
var exportPath = 'build/unknown';

function loadConfig(callback) {
  console.log('# loadConfig');
  var _file = __dirname.replace(/^(.+)\/([\w]+)$/gi, '$1') + '/assets/js/app/services/Inch33ElementsConfig.js';
  fs.readFile(_file, 'utf8', function (err, data) {
    if (err) { return callback('Error: ' + err, null); }
    data = data.replace('var Inch33ElementsConfig = ', '');
    var config = JSON.parse(data);
    callback(null, config);
  });
}

function exportNodes(nodes, baseElements, callback) {
  console.log('# exportNodes: ', nodes.length);
  var topElements = [], bottomElements = [];
  baseElements.forEach(function(el) {
    if ( el.template.indexOf('menu') >= 0 )
      topElements.push(el);
    else
      bottomElements.push(el);
  });
  async.eachSeries(nodes, function(node, _callback) {
    if ( !node.hasOwnProperty('softLink') ) {
      exportNode(node, topElements, bottomElements, nodes, function(err){
        _callback(err);
      });
    } else {
      _callback(false);
    }
  }, function ( err ) {
    if( err ) {
      console.log('Export node error');
      return callback('Export node error');
    }
    console.log('All nodes exported');
    callback(null, 'All nodes exported');
  });
}

function exportNode(node, topElements, bottomElements, nodes, callback) {
  console.log('# exportNode');
  Node.findOne({ _id: node._id }, 'link name elements').populate('elements', 'template data menuLink', null, { sort: { sortOrder: 1 } } ).exec(function(err, node){
    if (err) return callback('Node not found');
    var link = ( node.link ? node.link : 'index' ) + '.html';
    var elements = [];
    Array.prototype.push.apply(elements, topElements);
    Array.prototype.push.apply(elements, node.elements);
    Array.prototype.push.apply(elements, bottomElements);
    console.log('--', link, '--');
    exportElements(elements, nodes, function(err, content){
      if ( err ) callback(err);
      saveNode(link, content);
      console.log('# exportNode::complete:', link);
      callback(null, 'ok');
    });
  });
}

function saveNode(link, content) {
  var html = '<!DOCTYPE html>' +
      '<html>' +
        '<head>' +
          '<title>33inch</title>' +
          '<link rel="stylesheet" href="/assets/inch33.min.css">' +
          '<link rel="stylesheet" href="/assets/style.css">' +
          '<script src="/assets/inch33.js"></script>' +
          '<link href="http://fonts.googleapis.com/css?family=Dosis:400,700|Abel|Droid+Sans:400,700|Arvo:400,700,400italic,700italic|Poiret+One|Quicksand:400,700|Ubuntu:400,700,400italic,700italic|Bitter:400,700,400italic|Lobster+Two:400,700,400italic,700italic|Montserrat:400,700|Open+Sans:400italic,700italic,700,400|Pacifico|Raleway:400,700|Roboto+Slab:400,700|Roboto:400,400italic,700,700italic&amp;subset=latin,latin-ext" rel="stylesheet" type="text/css">' +
        '</head>' +
      '<body class="inch33">' +
        content +
      '</body>' +
    '</html>';
  fs.writeFileSync(exportPath + '/' + link, html);
}

function saveCss() {
  console.log('# saveCss');
  fs.writeFileSync(exportPath + '/assets/style.css', styles);
}

function exportElements(elements, nodes, callback) {
  console.log('# exportElements');
  var content = '';
  async.eachSeries(elements, function(element, _callback) {
    exportElement(element, nodes, function(err, result){
      content += result.content;
      styles += result.style;
      Array.prototype.push.apply(attachements, result.attachements);
      _callback(err);
    });
  }, function ( err ) {
    if( err ) {
      console.log('Export element error');
      return callback('Export node error');
    }
    console.log('All elements exported');
    callback(null, content);
  });

}

function exportElement(element, nodes, callback) {
  console.log('# exportElement');
  var _file = __dirname.replace(/^(.+)\/([\w]+)$/gi, '$1') + '/assets/views/app/website/components/' + element.template + '.jade';
  fs.readFile(_file, 'utf8', function (err, data) {
    if (err) return callback('Error: ' + err, null);
    var html = jade.compile(data)();
    var websiteElement = new WebsiteElementService();
    websiteElement.compile(element, html, config, nodes, function(err, result){
      if ( err )  callback(err);
      else        callback(null, result);
    });
  });
}

function copyAssets(callback) {
  console.log('# copyAssets', attachements);
  async.each(attachements, function(file, _callback) {
    console.log('# copy', file);
    if ( file.indexOf('/placeholder/') >= 0 ) {
      console.log('skip');
      return _callback(null);
    }
    file = file.replace(/["|']/gi, '');
    if ( file.indexOf('http://') < 0 && file.indexOf('/placeholder/') !== 0 ) {
      console.log('#COPY', 'public' + file, ' - to - ', exportPath + file.replace('/fx/', '/assets/'));
      fs.copy('public' + file, exportPath + file.replace('/fx/', '/assets/'), function (err) {
        _callback(err);
      });
    } else {
      console.log('#COPY2', 'skip');
      _callback(null);
    }
  }, function(err){
    if (err) {
      console.error('Copy attachements error', err);
    } else {
      console.error('Copy attachements complete');
    }
    callback();
  });
}

var WebsiteExportService = function(){};

WebsiteExportService.prototype.export = function(website, callback) {

  exportPath = 'build/' + website.permalink;
  if ( !fs.existsSync('build') )
    fs.mkdirSync('build');
  if ( !fs.existsSync(exportPath) )
    fs.mkdirSync(exportPath);
  if ( !fs.existsSync(exportPath + '/assets') )
    fs.mkdirSync(exportPath + '/assets');

  loadConfig(function(err, _config){
    if ( err )  callback(err);
    config = _config;
    website.populate('elements', 'template data menuLink', function(err, website){
      nodeCtrl.getMenu(website._id, function(err, nodes){
        if (err || !nodes) return callback('Nodes not found');
        exportNodes(nodes, website.elements, function(err, result){
          if ( err ) {
            callback( err );
            console.log('## exportNodes error', err);
          } else {
            saveCss();
            copyAssets( callback );
          }
        });
      });
    });
  });

};

module.exports = WebsiteExportService;
