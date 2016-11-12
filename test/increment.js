/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Increment = brownie.Increment;

describe('increment', function() {
  var increment;
  it('should be defined by one argument', function() {
    increment = Increment(3);
  });
  it('should be an object', function() {
    assert.equal(typeof increment, 'object');
  });
  it('should have a valid value property', function() {
    assert.equal(increment.value, 3);
  });
});