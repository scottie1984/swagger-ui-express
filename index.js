"use strict";

var fs = require("fs");

var favIconHtml =
  '<link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />' +
  '<link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />';

var setup = function(
  swaggerDoc,
  opts,
  options,
  customCss,
  customfavIcon,
  swaggerUrl,
  customeSiteTitle
) {
  var isExplorer;
  var customJs;
  if (opts && typeof opts === "object") {
    isExplorer = opts.explorer;
    options = opts.swaggerOptions;
    customCss = opts.customCss;
    customJs = opts.customJs;
    customfavIcon = opts.customfavIcon;
    swaggerUrl = opts.swaggerUrl;
    customeSiteTitle = opts.customSiteTitle;
  } else {
    //support legacy params based function
    isExplorer = opts;
  }
  options = options || {};
  var explorerString = isExplorer
    ? ""
    : ".swagger-ui .topbar .download-url-wrapper { display: none }";
  customCss = explorerString + " " + customCss || explorerString;
  customfavIcon = customfavIcon || false;
  customeSiteTitle = customeSiteTitle || "Swagger UI";
  var html = fs.readFileSync(__dirname + "/indexTemplate.html");
  try {
    fs.unlinkSync(__dirname + "/index.html");
  } catch (e) {}

  var favIconString = customfavIcon
    ? '<link rel="icon" href="' + customfavIcon + '" />'
    : favIconHtml;
  var htmlWithCustomCss = html.toString().replace("<% customCss %>", customCss);
  var htmlWithFavIcon = htmlWithCustomCss.replace(
    "<% favIconString %>",
    favIconString
  );
  var htmlWithCustomJs = htmlWithFavIcon.replace(
    "<% customJs %>",
    customJs ? `<script src="${customJs}"></script>` : ""
  );

  var initOptions = {
    swaggerDoc: swaggerDoc || undefined,
    customOptions: options,
    swaggerUrl: swaggerUrl || undefined
  };
  var htmlWithOptions = htmlWithCustomJs
    .replace("<% swaggerOptions %>", JSON.stringify(initOptions))
    .replace("<% title %>", customeSiteTitle);

  return htmlWithOptions;
};

var stringify = function(obj, prop) {
  var placeholder = "____FUNCTIONPLACEHOLDER____";
  var fns = [];
  var json = JSON.stringify(
    obj,
    function(key, value) {
      if (typeof value === "function") {
        fns.push(value);
        return placeholder;
      }
      return value;
    },
    2
  );
  json = json.replace(new RegExp('"' + placeholder + '"', "g"), function(_) {
    return fns.shift();
  });
  return json + ";";
};

// Return function and path only. let caller decide how to deliver results.
// This allows package to be framework agnostic.
module.exports = {
  setup: setup,
  serve: __dirname + "/static"
};
