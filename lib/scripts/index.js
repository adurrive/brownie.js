'use strict';

var fs = require('fs');
var path = require('path');

exports.init = fs.readFileSync(path.join(__dirname, 'init.groovy'), 'utf8');

exports.get = fs.readFileSync(path.join(__dirname, 'get.groovy'), 'utf8');

exports.save = fs.readFileSync(path.join(__dirname, 'save.groovy'), 'utf8');

exports.search = fs.readFileSync(path.join(__dirname, 'search.groovy'), 'utf8');