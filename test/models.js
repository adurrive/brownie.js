/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var models = require('../lib/models');
var VertexSchema = brownie.VertexSchema;

describe('models', function() {
  var vertexModelLight;
  it('should be an object', function() {
    assert.equal(typeof models, 'object');
  });
  it('should have a vertices object property', function() {
    assert.equal(typeof models.vertices, 'object');
  });
  it('should have an edges object property', function() {
    assert.equal(typeof models.edges, 'object');
  });
  it('should cache a new model', function() {
    vertexModelLight = brownie.model('vertexLabelLight', VertexSchema({
      yellow: {
        type: String,
        key: 0
      },
      orange: {
        type: String,
        key: 1
      }
    }));
    assert.equal(models.vertices.vertexLabelLight, vertexModelLight);
  });
  it('should have a set method', function() {
    assert.equal(typeof models.set, 'function');
  });
  it('should have a valid get method', function() {
    assert.equal(models.get('vertex', 'vertexLabelLight'), vertexModelLight);
  });
  it('should have an initialize method', function() {
    assert.equal(typeof models.initialize, 'function');
  });
  it('should have a valid reset method', function() {
    models.reset();
    assert.equal(Object.keys(models.get('vertices')).length, 0);
    assert.equal(Object.keys(models.get('edges')).length, 0);
  });
});