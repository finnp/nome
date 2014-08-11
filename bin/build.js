#!/usr/bin/env node

var fs         = require('fs');
var path       = require('path');
var uglifyjs   = require('uglify-js');
var browserify = require('browserify');
var banner     = fs.readFileSync(__dirname + '/../LICENSE').toString()
var src        = __dirname + '/../src/nome.coffee';

function minify(source) {
  var opts = { fromString: true, mangle: {
    toplevel: true
  }};
  return uglifyjs.minify(source, opts).code;
}

var bannerLines = banner.split("\n");
for (var i = 0, ii = bannerLines.length; i < ii; i++) {
  bannerLines[i] = "* " + bannerLines[i]
};
bannerLines.unshift("/*");
bannerLines.push("*/", "");
banner = bannerLines.join("\n");

var coffee = require('coffee-script');
var compiled = coffee.compile(fs.readFileSync(__dirname + '/../src/nome.coffee').toString(), {
  bare: true
});

var minified = minify(compiled);

fs.writeFileSync(__dirname + '/../lib/nome.js', banner + compiled);
fs.writeFileSync(__dirname + '/../lib/nome.min.js', banner + minified);

var bundleOptions = {
  entries: __dirname + '/../lib/nome.js',
  standalone: 'nome',
};

browserify(bundleOptions).bundle(function(err, buf) {
  if (err) {
    return console.error(err);
  }
  var out = buf.toString();
  fs.writeFileSync(__dirname + '/../lib/nome-browser.js', out);
  fs.writeFileSync(__dirname + '/../lib/nome-browser.min.js', banner + minify(out));
});
