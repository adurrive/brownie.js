/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var CompositeIndex = brownie.CompositeIndex;

describe('compositeIndex', function() {
  var compositeIndex;
  it('should be defined by two arguments', function() {
    compositeIndex = CompositeIndex('byTest', {
      test: true
    });
  });
  it('should be an object', function() {
    assert.equal(typeof compositeIndex, 'object');
  });
  it('should have a valid name property', function() {
    assert.equal(compositeIndex.name, 'byTest');
  });
  it('should have a valid keys property', function() {
    assert.deepEqual(compositeIndex.keys, {
      test: true
    });
  });
  it('should have a valid unique property', function() {
    assert.equal(compositeIndex.unique, false);
  });
  it('should have a valid global property', function() {
    assert.equal(compositeIndex.global, false);
  });
});