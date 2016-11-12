/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Script = brownie.Script;

describe('script', function() {
  var script;
  it('should be defined by two arguments', function() {
    script = Script('g.V().limit(10).count()', { limit: 10 });
  });
  it('should be an object', function() {
    assert.equal(typeof script, 'object');
  });
  it('should have a valid script property', function() {
    assert.equal(script.script, 'g.V().limit(10).count()');
  });
  it('should have a valid bindings object property', function() {
    assert.deepEqual(script.bindings, { limit: 10 });
  });
});