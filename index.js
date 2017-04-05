'use strict'

var fs = require('fs');
var express = require('express');

var explorerHtml = '<form id="api_selector">'+
                        '<div class="input"><input placeholder="http://example.com/api" id="input_baseUrl" name="baseUrl" type="text"/></div>' +
                        '<div id="auth_container"></div>' +
                        '<div class="input"><a id="explore" class="header__btn" href="#" data-sw-translate>Explore</a></div>' +
                      '</form>';

var favIconHtml = '<link rel="icon" type="image/png" href="images/favicon-32x32.png" sizes="32x32" />' +
                  '<link rel="icon" type="image/png" href="images/favicon-16x16.png" sizes="16x16" />'


var setup = function(swaggerDoc, explorer, options, customCss, customfavIcon) {
	options = options || {};
    customCss = customCss || '';
    customfavIcon = customfavIcon || false;
	var html = fs.readFileSync(__dirname + '/indexTemplate.html');
    try {
    	fs.unlinkSync(__dirname + '/index.html');
    } catch (e) {

    }
    var htmlWithSwaggerReplaced = html.toString().replace('<% swaggerDoc %>', JSON.stringify(swaggerDoc));
    var explorerString = explorer ?  explorerHtml : '';
    var favIconString = customfavIcon ? '<link rel="icon" href="' + customfavIcon + '" />' : favIconHtml;
    var explorerHtmlWithSwagger = htmlWithSwaggerReplaced.replace('<% explorerString %>', explorerString);
    var indexHTML = explorerHtmlWithSwagger.replace('<% customOptions %>', JSON.stringify(options))
    var htmlWithCustomCss  = indexHTML.replace('<% customCss %>', customCss);
    var htmlWithFavIcon  = htmlWithCustomCss.replace('<% favIconString %>', favIconString);
    
    return function(req, res) { res.send(htmlWithFavIcon) };
};

var serve = express.static(__dirname + '/static')

module.exports = {
	setup: setup,
	serve: serve
};
