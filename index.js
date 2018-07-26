'use strict'

var fs = require('fs');
var express = require('express');

var favIconHtml = '<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />' +
                  '<link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />'

var swaggerInit

var generateHTML = function (swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle) {
  var isExplorer
  var customJs
  if (opts && typeof opts === 'object') {
    isExplorer = opts.explorer
    options = opts.swaggerOptions
    customCss = opts.customCss
    customJs = opts.customJs
    customfavIcon = opts.customfavIcon
    swaggerUrl = opts.swaggerUrl
    customeSiteTitle = opts.customSiteTitle
  } else {
    //support legacy params based function
    isExplorer = opts
  }
	options = options || {};
  var explorerString = isExplorer ? '' : '.swagger-ui .topbar .download-url-wrapper { display: none }';
    customCss = explorerString + ' ' + customCss || explorerString;
    customfavIcon = customfavIcon || false;
    customeSiteTitle = customeSiteTitle || 'Swagger UI';
	var html = fs.readFileSync(__dirname + '/indexTemplate.html');
    try {
    	fs.unlinkSync(__dirname + '/index.html');
    } catch (e) {

    }

    var favIconString = customfavIcon ? '<link rel="icon" href="' + customfavIcon + '" />' : favIconHtml;
    var htmlWithCustomCss = html.toString().replace('<% customCss %>', customCss);
    var htmlWithFavIcon = htmlWithCustomCss.replace('<% favIconString %>', favIconString);
    var htmlWithCustomJs = htmlWithFavIcon.replace('<% customJs %>', customJs ? `<script src="${customJs}"></script>` : '');

    var initOptions = {
      swaggerDoc: swaggerDoc || undefined,
      customOptions: options,
      swaggerUrl: swaggerUrl || undefined
    }
    var js = fs.readFileSync(__dirname + '/swagger-ui-init.js');
    swaggerInit = js.toString().replace('<% swaggerOptions %>', stringify(initOptions))
    return htmlWithCustomJs.replace('<% title %>', customeSiteTitle)
}

var replaceNonce = function(html, nonce) {
  return html.replace('<% nonce %>', nonce || '').replace('<% nonce %>', nonce || '');
}

var setup = function (swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle) {
    var html = generateHTML(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle)
    return function (req, res) {
      res.send(replaceNonce(html, res.locals.nonce));
    };
};

function swaggerInitFn (req, res, next) {
  if (req.url === '/swagger-ui-init.js') {
    res.set('Content-Type', 'application/javascript')
    res.send(swaggerInit)
  } else {
    next()
  }
}

var swaggerInitFunction = function (swaggerDoc, opts) {
  var js = fs.readFileSync(__dirname + '/swagger-ui-init.js');
  var swaggerInitFile = js.toString().replace('<% swaggerOptions %>', stringify(opts))
  return function (req, res, next) {
    if (req.url === '/swagger-ui-init.js') {
      res.set('Content-Type', 'application/javascript')
      res.send(swaggerInitFile)
    } else {
      next()
    }
  }
} 

var serveFiles = function (swaggerDoc, opts) {
  opts = opts || {}
  var initOptions = {
    swaggerDoc: swaggerDoc || undefined,
    customOptions: opts.swaggerOptions || {},
    swaggerUrl: opts.swaggerUrl || {}
  }
  var swaggerInitWithOpts = swaggerInitFunction(swaggerDoc, initOptions)
  return [swaggerInitWithOpts, express.static(__dirname + '/static')]
}

var serve = [swaggerInitFn, express.static(__dirname + '/static')];
var serveWithOptions = options => [swaggerInitFn, express.static(__dirname + '/static', options)];

var stringify = function (obj, prop) {
  var placeholder = '____FUNCTIONPLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift();
  });
  return 'var options = ' + json + ';';
};

module.exports = {
	setup: setup,
	serve: serve,
  serveWithOptions: serveWithOptions,
  generateHTML: function() {
    var html = generateHTML.call(null, arguments);

    return replaceNonce(html);
  },
  serveFiles: serveFiles
};
