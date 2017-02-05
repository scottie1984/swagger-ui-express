'use strict'

var fs = require('fs');
var express = require('express');

var explorerHtml = '<form id="api_selector">'+
                        '<div class="input"><input placeholder="http://example.com/api" id="input_baseUrl" name="baseUrl" type="text"/></div>' +
                        '<div id="auth_container"></div>' +
                        '<div class="input"><a id="explore" class="header__btn" href="#" data-sw-translate>Explore</a></div>' +
                      '</form>';

var setup = function(swaggerDoc, explorer, options) {
	options = options || {};
	var html = fs.readFileSync(__dirname + '/indexTemplate.html');
    try {
    	fs.unlinkSync(__dirname + '/index.html');
    } catch (e) {

    }
    var htmlWithSwaggerReplaced = html.toString().replace('<% swaggerDoc %>', JSON.stringify(swaggerDoc));
    var explorerString = explorer ?  explorerHtml : '';
    var explorerHtmlWithSwagger = htmlWithSwaggerReplaced.replace('<% explorerString %>', explorerString);
    var indexHTML = explorerHtmlWithSwagger.replace('<% customOptions %>', JSON.stringify(options))
    return function(req, res) { res.send(indexHTML) };
};

var serve = express.static(__dirname + '/static')

module.exports = {
	setup: setup,
	serve: serve
};
