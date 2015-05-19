'use strict';

var fs = require('fs');
var jsdom = require('jsdom');
var async = require('async');
var Node = require('../models/node');

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
      if ( err )
        console.error('# exportNode::error', err);
      else
        console.error('# exportNode::complete: ', node.link);
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
    callback(null, 'ok');
//    exportElements(node.elements, null, function(err, content){
//      if ( err ) callback(err);
//      console.log('#content:', content);
//      callback(null, 'ok');
//    });
  });
}

function exportElements(elements, content, callback) {
  setTimeout(function(){
    callback(null, 'exported elements');
  }, 100);
//  if ( !content ) content = '';
//  if ( elements.length ) {
//    var element = elements.shift();
//    exportElement(element, function(err, _content){
//      if ( err )  return callback( err );
//      content += _content;
//      exportElements(elements, content, callback);
//    });
//  } else {
//    callback(content);
//  }
}


function exportElement(element, callback) {
  console.log('##', element.template);
  callback(null, ' #'+element.template+'# ');
}

//
//    jsdom.env(
//      '<p><a class="the-link" href="https://github.com/tmpvar/jsdom">jsdom!</a></p>',
//      ["http://code.jquery.com/jquery.js"],
//      function (errors, window) {
//        console.log("contents of a.the-link:", window.$("a.the-link").text());
//      }
//    );



function buildElements(websiteId) {

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



