'use strict';

var jsdom = require('jsdom');

var _style = '';
var _attachements = [];

function registerStyle(selector, style) {
  var css = '';
  for( var attr in style ) {
    css += attr.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase() + ': ' + style[attr] + '; '
    if( String(style[attr]).indexOf('url(') >= 0 )
      _attachements.push( String(style[attr]).replace(/^url\((.+)\)$/, '$1') );
  }
  _style += '.inch33 ' + selector + ' { ' + css + '} ';
}

var WebsiteElementService = function(){};

WebsiteElementService.prototype.compile = function(elementData, html, config, nodes, callback) {

  console.log('---- ' + elementData.template + ' ----');

  var _conf = config.hasOwnProperty(elementData.template) ? config[elementData.template] : null;
  var _columns = _conf && _conf.hasOwnProperty('columns') ? _conf.columns : null;
  var _elements = _conf && _conf.hasOwnProperty('elements') ? _conf.elements : null;
  _style = '';
  _attachements = [];

  jsdom.env(
    html,
    function (errors, window) {

      var _baseElement = window.document.body.querySelector('*');
      var _class = _baseElement.getAttribute('class').split(' ').join('.');
      var _cssSelector = ( _class ? '.' + _class : '' ) + '.e' + elementData._id + ' ';


      // styles
      if ( elementData.data.hasOwnProperty('style') && elementData.data.style )
        registerStyle(_cssSelector, elementData.data.style);
      _baseElement.setAttribute('class', _cssSelector.replace(/\./g, ' ').trim());

      //  columns repeater
      var _cols = null;
      if ( _columns ) {
        _cols = _baseElement.querySelector('.columns');
        var _colTmpl = _baseElement.querySelector('.columns > *').outerHTML;
        var _colsTmpl = '';
        elementData.data.columns.forEach(function(){
          _colsTmpl += _colTmpl;
        });
        _cols.innerHTML = _colsTmpl;
        _cols.setAttribute('class', 'col-' + elementData.data.columnCount);
      }

      //  menu
      if ( elementData.template.indexOf('menu') >= 0 ) {
        var _logo = _baseElement.querySelector('.logo');
        if ( _logo && elementData.data && elementData.data.logoImage ) {
          _logo.innerHTML = '<a href="/"><img src="'+elementData.data.logoImage+'" /></a>';
          _attachements.push(elementData.data.logoImage);
        }
        if ( elementData.data.textColor )
          registerStyle(_cssSelector + 'ul li a', {color: elementData.data.textColor});
        var _nav = '';
        nodes.forEach(function(_node) {
          _nav += '<li><a href="/' + (_node.link ? _node.link + '.html' : '') + '">' + _node.name + '</a></li>';
        });
        _baseElement.querySelector('ul').innerHTML = _nav;
      }

      //  elements
      if ( _elements ) {
        _elements.forEach(function(element){
          element.id = element.selector.replace(/[^a-z0-9]+/gi, ' ').trim().replace(/ /gi, '-');
          var _el = _baseElement.querySelector(element.selector);

          // styles
          if ( elementData.data.hasOwnProperty(element.id) && elementData.data[element.id] && elementData.data[element.id].hasOwnProperty('style') )
            registerStyle(_cssSelector + element.selector, elementData.data[element.id].style);

          //  remove hidden elements
          if ( elementData.data && elementData.data[element.id] && elementData.data[element.id].hasOwnProperty('elements') && !elementData.data[element.id].elements ) {
            var _els = _baseElement.querySelectorAll(element.selector);
            for ( var __el in _els ) {
              if ( parseInt(__el) == __el )
                _els[__el].parentElement.removeChild(_els[__el]);
            }
          }

          //  texts
          if ( element.type && element.type == 'text' ) {
            if ( element.column ) {
              //  columns text
              if ( _cols ) {
                var _els = _baseElement.querySelectorAll(element.selector);
                elementData.data.columns.forEach(function(_colData, i){
                  _els[i].innerHTML = _colData[element.id].text;
                })
              }
            } else {
              //  regular text
              if ( elementData.data && elementData.data[element.id] ) {
                _el.innerHTML = elementData.data[element.id].text;
              }
            }
          }

          //  background
          if ( element.type && element.type == 'background' ) {
            if ( element.column ) {
              //  columns background
              elementData.data.columns.forEach(function(_colData, i){
                if ( _colData[element.id] && _colData[element.id].style )
                  registerStyle( _cssSelector + element.selector + ':nth-child(n+' + ( i+1 ) + ')', _colData[element.id].style )
              })
            } else {
              console.error('element.type(background, !column) not supported');
            }
          }

          //  attachement
          if ( element.type && element.type == 'attachement' ) {
            if ( element.column ) {
              if ( _cols ) {
                var _els = _baseElement.querySelectorAll(element.selector);
                elementData.data.columns.forEach(function(_colData, i){
                  if ( _colData[element.id] && _colData[element.id].attachement ) {
                    var _a = _els[i].querySelector('a');
                    if ( _a ) {
                      _a.setAttribute('href', _colData[element.id].attachement);
                      _a.setAttribute('target', '_blank');
                      _attachements.push(_colData[element.id].attachement);
                    }
                  }
                });
              }
            } else {
              console.error('element.type(attachement, !column) not supported');
            }
          }


        })
      }
      //console.log('output', _baseElement.outerHTML);
      //console.log('style', _style);
      //console.log('attachements', _attachements);

      callback(null, {
        content: _baseElement.outerHTML,
        style: _style,
        attachements: _attachements
      });
    }
  );
}

module.exports = WebsiteElementService;
