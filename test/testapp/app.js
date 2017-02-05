var express = require('express');
var app = express();
var swaggerUi = require('../../index');
var swaggerDocument = require('./swagger.json');

var options = {
	validatorUrl : null
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, false, options));

app.get('/', function(req, res) { res.json({ status: 'OK'}); });
app.get('/bar', function(req, res) { res.json({ status: 'OKISH'}); });

module.exports = app;
