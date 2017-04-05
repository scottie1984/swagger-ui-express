var express = require('express');
var app = express();
var swaggerUi = require('../../index');
var swaggerDocument = require('./swagger.json');

app.use((req, res, next) => {
	if (req.url === '/favicon.ico') {
		res.sendFile(__dirname + '/favicon.ico');
	} else {
		next();
	}
});

var options = {
	validatorUrl : null,
	oauth: {
	 clientId: "your-client-id1",
	 clientSecret: "your-client-secret-if-required1",
	 realm: "your-realms1",
	 appName: "your-app-name1",
	 scopeSeparator: ",",
	 additionalQueryStringParams: {}
 }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, false, options, ''));

app.get('/', function(req, res) { res.json({ status: 'OK'}); });
app.get('/bar', function(req, res) { res.json({ status: 'OKISH'}); });

module.exports = app;
