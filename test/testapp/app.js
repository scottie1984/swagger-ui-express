var express = require('express');
var app = express();
var swaggerUi = require('../../index');
var swaggerDocument = require('./swagger.json');

app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
    res.sendFile(__dirname + '/favicon.ico');
  } else if (req.url === '/swagger.json') {
    res.sendFile(__dirname + '/swagger.json');
  } else {
    next();
  }
});

var options = {
  validatorUrl: null,
  oauth: {
    clientId: 'your-client-id1',
    clientSecret: 'your-client-secret-if-required1',
    realm: 'your-realms1',
    appName: 'your-app-name1',
    scopeSeparator: ',',
    additionalQueryStringParams: {}
  },
  docExpansion: 'full'
};

app.get('/test', function (req, res) { res.json({ status: 'OK' }); });
app.get('/bar', function (req, res) { res.json({ status: 'OKISH' }); });

app.use('/api-docs', express.static(swaggerUi.serve));
app.get('/api-docs', function (req, res) {
  res.send(swaggerUi.setup(swaggerDocument, false, options, '.swagger-ui .topbar { background-color: red }'));
});

app.use('/api-docs-from-url', express.static(swaggerUi.serve));
app.get('/api-docs-from-url', function (req, res) {
  res.send(swaggerUi.setup(null, false, options, '.swagger-ui .topbar { background-color: red }', null, '/swagger.json'));
});

var swaggerUiOpts = {
  explorer: false,
  swaggerOptions: options,
  customCss: '.swagger-ui .topbar { background-color: blue }'
};

app.use('/api-docs-using-object', express.static(swaggerUi.serve));
app.get('/api-docs-using-object', function (req, res) {
  res.send(swaggerUi.setup(swaggerDocument, swaggerUiOpts));
});

var swaggerUiOpts2 = {
  explorer: false,
  swaggerOptions: options,
  customCss: '.swagger-ui .topbar { background-color: pink }',
  swaggerUrl: "/swagger.json",
  customJs: "/my-custom.js"
};

app.use("/api-docs-from-url-using-object", express.static(swaggerUi.serve));
app.get("/api-docs-from-url-using-object", function (req, res) {
  res.send(swaggerUi.setup(null, swaggerUiOpts2));
});

app.use("/api-docs-with-null", express.static(swaggerUi.serve));
app.get("/api-docs-with-null", function (req, res) {
  res.send(swaggerUi.setup(swaggerDocument, null, options, ".swagger-ui .topbar { background-color: orange }"));
});

app.use(function (req, res) {
  res.send(404, "Page not found");
});

module.exports = app;
