/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var MixedIndex = brownie.MixedIndex;
var Mappings = brownie.Mappings;

describe('mixedIndex', function() {
  var mixedIndex;
  it('should be defined by three arguments', function() {
    mixedIndex = MixedIndex('byTest', 'search', {
      test: Mappings.DEFAULT
    });
  });
  it('should be an object', function() {
    assert.equal(typeof mixedIndex, 'object');
  });
  it('should have a valid name property', function() {
    assert.equal(mixedIndex.name, 'byTest');
  });
  it('should have a valid backendName property', function() {
    assert.equal(mixedIndex.backendName, 'search');
  });
  it('should have a valid keys property', function() {
    assert.deepEqual(mixedIndex.keys, {
      test: Mappings.DEFAULT
    });
  });
  it('should have a valid global property', function() {
    assert.equal(mixedIndex.global, false);
  });
});