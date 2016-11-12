const express = require('express');
const app = express();
const swaggerUi = require('../../index');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.json({ status: 'OK'}))
app.get('/bar', (req, res) => res.json({ status: 'OKISH'}))

module.exports = app;