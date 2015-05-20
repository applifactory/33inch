'use strict';

var fs = require('fs');
var async = require('async');
var jade = require('jade');
var Node = require('../models/node');
var WebsiteElement = require('./WebsiteElementService');

var headers = '';
var footers = '';
var config = null;
var styles = '';

function loadConfig(callback) {
  var _file = __dirname.replace(/^(.+)\/([\w]+)$/gi, '$1') + '/assets/js/app/services/Inch33ElementsConfig.js';
  fs.readFile(_file, 'utf8', function (err, data) {
    if (err) return callback('Error: ' + err, null);
    data = data.replace('var Inch33ElementsConfig = ', '');
    var config = JSON.parse(data);
    callback(null, config);
  });
}

function exportNodes(nodes, callback) {
  console.log('# exportNodes: ', nodes.length);
  async.eachSeries(nodes, function(node, _callback) {
    exportNode(node, function(err){
      _callback(err);
    });
  }, function ( err ) {
    if( err ) {
      console.log('Export node error');
      return callback('Export node error');
    }
    console.log('All nodes exported');
    callback(null, 'All nodes exported')
  });
}

function exportNode(node, callback) {
  console.log('# exportNode: ', node.link);
  Node.findOne({ _id: node._id }, 'link name elements').populate('elements', 'template data', null, { sort: { sortOrder: 1 } } ).exec(function(err, node){
    if (err) return callback('Node not found');
    var link = ( node.link ? node.link : 'index' ) + '.html';
    console.log('--', link, '--');
    exportElements(node.elements, function(err, content){
      if ( err ) callback(err);
      console.log('# exportNode::complete:', content);
      callback(null, 'ok');
    });
  });
}

function exportElements(elements, callback) {
  var content = '';
  async.eachSeries(elements, function(element, _callback) {
    exportElement(element, function(err, _content){
      content += _content;
      _callback(err);
    });
  }, function ( err ) {
    if( err ) {
      console.log('Export element error');
      return callback('Export node error');
    }
    console.log('All elements exported');
    callback(null, content)
  });

}

function exportElement(element, callback) {
  var _file = __dirname.replace(/^(.+)\/([\w]+)$/gi, '$1') + '/assets/views/app/website/components/' + element.template + '.jade';
  fs.readFile(_file, 'utf8', function (err, data) {
    if (err) return callback('Error: ' + err, null);
    var html = jade.compile(data)();

    WebsiteElement.compile(element, html, config, function(err, content){
      if ( err )  console.error('WebsiteElement.compile::error', err);
      else        console.log('WebsiteElement.compile::success', data);
    });



    //callback(null, ' #'+element.template+'# ' + html);
  });
}

module.exports.export = function(website, callback) {

  console.log('exporting...');
  loadConfig(function(err, _config){
    if ( err )  callback(err);
    config = _config;
    Node.find( { parentWebsite: website._id }, 'name link nodes' ).populate('nodes', 'name link').sort('sortOrder').exec(function(err, nodes){
      if (err || !nodes) return callback('Nodes not found');
      exportNodes(nodes, function(err, result){
        if ( err ) {
          callback( err );
          console.log('## exportNodes error', err);
        } else {
          callback( null );
          console.log('## exportNodes success');
        }
      });
    });
  });

}



