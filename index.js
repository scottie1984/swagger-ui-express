'use strict'

const fs = require('fs');
const express = require('express');

const explorerHtml = `<form id='api_selector'>
                        <div class='input'><input placeholder="http://example.com/api" id="input_baseUrl" name="baseUrl" type="text"/></div>
                        <div id='auth_container'></div>
                        <div class='input'><a id="explore" class="header__btn" href="#" data-sw-translate>Explore</a></div>
                      </form>`

const setup = (swaggerDoc, explorer) => {
	const html = fs.readFileSync(__dirname + '/indexTemplate.html');
    try {
    	fs.unlinkSync(__dirname + '/index.html');
    } catch (e) {

    }
    const htmlWithSwaggerReplaced = html.toString().replace('<% swaggerDoc %>', JSON.stringify(swaggerDoc));
    const explorerString = explorer ?  explorerHtml : '';
    const indexHTML = htmlWithSwaggerReplaced.replace('<% explorerString %>', explorerString)
    return (req, res) => res.send(indexHTML);
}

const serve = express.static(__dirname + '/static')

module.exports = {
	setup,
	serve
};