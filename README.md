# Swagger UI Express

Adds middleware to your express app to serve the Swagger UI bound to your Swagger document. This acts as living documentation for your API hosted from within your app.

## Usage

In app's `package.json`

    "swagger-ui-express": "latest" // or desired version

Express setup `app.js`
```javascript
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

Open http://<app_host>:<app_host>/api-docs in your browser to view the documentation.

## Requirements

* Node v4.2 or above
* Express 4 or above