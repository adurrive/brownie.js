/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var settings = require('../lib/settings');
var connection = require('../lib/connection');
var models = require('../lib/models');

describe('brownie', function() {
  this.timeout(10000);
  it('should be an object', function() {
    assert.equal(typeof brownie, 'object');
  });
  it('should have a connect method', function() {
    assert.equal(typeof brownie.connect, 'function');
  });
  it('should connect to the local Gremlin server', function() {
    return brownie.connect({ log: 1 });
  });
  it('should have a valid settings object property', function() {
    assert.equal(brownie.settings, settings.get());
  });
  it('should have a valid connection property', function() {
    assert.equal(brownie.connection, connection);
  });
  it('should have a valid models property', function() {
    assert.equal(brownie.models, models);
  });
  it('should have a model method', function() {
    assert.equal(typeof brownie.model, 'function');
  });
  it('should have an initialize method', function() {
    assert.equal(typeof brownie.initialize, 'function');
  });
  it('should have an execute method', function() {
    assert.equal(typeof brownie.execute, 'function');
  });
  it('should have a messageGraph method', function() {
    assert.equal(typeof brownie.messageGraph, 'function');
  });
  it('should have a messageStream method', function() {
    assert.equal(typeof brownie.messageStream, 'function');
  });
  it('should have a VertexSchema method', function() {
    assert.equal(typeof brownie.VertexSchema, 'function');
  });
  it('should have an EdgeSchema method', function() {
    assert.equal(typeof brownie.EdgeSchema, 'function');
  });
  it('should have a Graph method', function() {
    assert.equal(typeof brownie.Graph, 'function');
  });
  it('should have a Script method', function() {
    assert.equal(typeof brownie.Script, 'function');
  });
  it('should have an Increment method', function() {
    assert.equal(typeof brownie.Increment, 'function');
  });
  it('should have a CompositeIndex method', function() {
    assert.equal(typeof brownie.CompositeIndex, 'function');
  });
  it('should have a MixedIndex method', function() {
    assert.equal(typeof brownie.MixedIndex, 'function');
  });
  it('should have a Types object property', function() {
    assert.equal(typeof brownie.Types, 'object');
  });
  it('should have a Multiplicities object property', function() {
    assert.equal(typeof brownie.Multiplicities, 'object');
  });
  it('should have a Mappings object property', function() {
    assert.equal(typeof brownie.Mappings, 'object');
  });
});