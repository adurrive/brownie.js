/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Types = brownie.Types;

describe('types', function() {
  Object.keys(Types).forEach(function (type) {
    it(type + ' should have a name property', function() {
      assert.equal(Types[type].hasOwnProperty('name'), true);
    });
    it(type + ' should have a titan property', function() {
      assert.equal(Types[type].hasOwnProperty('titan'), true);
    });
    it(type + ' should have an isKey property', function() {
      assert.equal(Types[type].hasOwnProperty('isKey'), true);
    });
    it(type + ' should have an isNumber property', function() {
      assert.equal(Types[type].hasOwnProperty('isNumber'), true);
    });
    it(type + ' should have an isString property', function() {
      assert.equal(Types[type].hasOwnProperty('isString'), true);
    });
    it(type + ' should have a toTitan method', function() {
      assert.equal(typeof Types[type].toTitan, 'function');
    });
    it(type + ' should have a fromTitan method', function() {
      assert.equal(typeof Types[type].fromTitan, 'function');
    });
    it(type + ' should have a toString method', function() {
      assert.equal(typeof Types[type].toString, 'function');
    });
    it(type + ' should have a fromString method', function() {
      assert.equal(typeof Types[type].fromString, 'function');
    });
    it(type + ' should have a validate method', function() {
      assert.equal(typeof Types[type].validate, 'function');
    });
  });
});