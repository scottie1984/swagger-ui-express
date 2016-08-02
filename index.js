'use strict'

const fs = require('fs');
const express = require('express');

const setup = swaggerDoc => {
	const html = fs.readFileSync(__dirname + '/indexTemplate.html');
    try {
    	fs.unlinkSync(__dirname + '/index.html');
    } catch (e) {

    }
    const indexHTML = html.toString().replace('<% swaggerDoc %>', JSON.stringify(swaggerDoc));
    return (req, res) => res.send(indexHTML);
}

const serve = express.static(__dirname + '/static')

module.exports = {
	setup,
	serve
};