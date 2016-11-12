/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var connection = require('../lib/connection');

describe('connection', function() {
  it('should be an object', function() {
    assert.equal(typeof connection, 'object');
  });
  it('should have a client object property', function() {
    assert.equal(typeof connection.client, 'object');
  });
  it('should have a connect method', function() {
    assert.equal(typeof connection.connect, 'function');
  });
  it('should have a connected method', function() {
    assert.equal(typeof connection.connected, 'function');
  });
  it('should have an execute method', function() {
    assert.equal(typeof connection.execute, 'function');
  });
  it('should have a messageStream method', function() {
    assert.equal(typeof connection.messageStream, 'function');
  });
});