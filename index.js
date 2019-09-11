'use strict'

var fs = require('fs')
var express = require('express')
var swaggerUi = require('swagger-ui-dist')
var htmlTplString = fs.readFileSync(__dirname + '/indexTemplate.html.tpl')
var jsTplString = fs.readFileSync(__dirname + '/swagger-ui-init.js.tpl')

var favIconHtml = '<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />' +
  '<link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />'

var swaggerInit = ''

var generateHTML = function (swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle, _htmlTplString, _jsTplString) {
  var isExplorer
  var customJs
  var swaggerUrls
  var customCssUrl
  if (opts && typeof opts === 'object') {
    options = opts.swaggerOptions
    customCss = opts.customCss
    customJs = opts.customJs
    customfavIcon = opts.customfavIcon
    swaggerUrl = opts.swaggerUrl
    swaggerUrls = opts.swaggerUrls
    isExplorer = opts.explorer || !!swaggerUrls
    customeSiteTitle = opts.customSiteTitle
    customCssUrl = opts.customCssUrl
  } else {
    //support legacy params based function
    isExplorer = opts
  }
  options = options || {}
  var explorerString = isExplorer ? '' : '.swagger-ui .topbar .download-url-wrapper { display: none }'
  customCss = explorerString + ' ' + customCss || explorerString
  customfavIcon = customfavIcon || false
  customeSiteTitle = customeSiteTitle || 'Swagger UI'
  _htmlTplString = _htmlTplString || htmlTplString
  _jsTplString = _jsTplString || jsTplString

  var favIconString = customfavIcon ? '<link rel="icon" href="' + customfavIcon + '" />' : favIconHtml
  var htmlWithCustomCss = _htmlTplString.toString().replace('<% customCss %>', customCss)
  var htmlWithFavIcon = htmlWithCustomCss.replace('<% favIconString %>', favIconString)
  var htmlWithCustomJs = htmlWithFavIcon.replace('<% customJs %>', customJs ? `<script src="${customJs}"></script>` : '')
  var htmlWithCustomCssUrl = htmlWithCustomJs.replace('<% customCssUrl %>', customCssUrl ? `<link href="${customCssUrl}" rel="stylesheet">` : '')

  var initOptions = {
    swaggerDoc: swaggerDoc || undefined,
    customOptions: options,
    swaggerUrl: swaggerUrl || undefined,
    swaggerUrls: swaggerUrls || undefined
  }

  swaggerInit = _jsTplString.toString().replace('<% swaggerOptions %>', stringify(initOptions))
  return htmlWithCustomCssUrl.replace('<% title %>', customeSiteTitle)
}

var setup = function (swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle) {
  var html = generateHTML(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle, htmlTplString, jsTplString)
  return function (req, res) {
    if (req.swaggerDoc) {
      var reqHtml = generateHTML(swaggerDoc, opts, options, customCss, customfavIcon, swaggerUrl, customeSiteTitle, htmlTplString, jsTplString)
      res.send(reqHtml)
    } else {
      res.send(html)
    }
  }
}

var swaggerInitFn = function (req, res, next) {
  if (req.url === '/swagger-ui-init.js') {
    res.set('Content-Type', 'application/javascript')
    res.send(swaggerInit)
  } else {
    next()
  }
}

var swaggerInitFunction = function (swaggerDoc, opts) {
  var swaggerInitFile = jsTplString.toString().replace('<% swaggerOptions %>', stringify(opts))
  return function (req, res, next) {
    if (req.url === '/swagger-ui-init.js') {
      res.set('Content-Type', 'application/javascript')
      res.send(swaggerInitFile)
    } else {
      next()
    }
  }
}

var swaggerAssetMiddleware = options => {
  var opts = options || {}
  opts.index = false
  return express.static(swaggerUi.getAbsoluteFSPath(), opts)
}

var serveFiles = function (swaggerDoc, opts) {
  opts = opts || {}
  var initOptions = {
    swaggerDoc: swaggerDoc || undefined,
    customOptions: opts.swaggerOptions || {},
    swaggerUrl: opts.swaggerUrl || {},
    swaggerUrls: opts.swaggerUrls || undefined
  }
  var swaggerInitWithOpts = swaggerInitFunction(swaggerDoc, initOptions)
  return [swaggerInitWithOpts, swaggerAssetMiddleware()]
}

var serve = [swaggerInitFn, swaggerAssetMiddleware()]
var serveWithOptions = options => [swaggerInitFn, swaggerAssetMiddleware(options)]

var stringify = function (obj, prop) {
  var placeholder = '____FUNCTIONPLACEHOLDER____'
  var fns = []
  var json = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      fns.push(value)
      return placeholder
    }
    return value
  }, 2)
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift()
  })
  return 'var options = ' + json + ';'
}

module.exports = {
  setup: setup,
  serve: serve,
  serveWithOptions: serveWithOptions,
  generateHTML: generateHTML,
  serveFiles: serveFiles
}
