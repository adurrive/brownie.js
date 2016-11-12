/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Geoshape = brownie.Geoshape;

describe('geoshape', function() {
  it('should have a point method', function() {
    assert.equal(typeof Geoshape.point, 'function');
  });
  it('should have a circle method', function() {
    assert.equal(typeof Geoshape.circle, 'function');
  });
  it('should have a box method', function() {
    assert.equal(typeof Geoshape.box, 'function');
  });
  describe('point', function() {
    var point;
    it('should be defined by two arguments', function() {
      point = Geoshape.point(1, 2);
      assert.deepEqual(point, Geoshape('Point', [2, 1]));
    });
    it('should be a valid object', function() {
      assert.equal(typeof point, 'object');
      assert.deepEqual(point, {
        type: 'Point',
        coordinates: [2, 1]
      });
    });
  });
  describe('circle', function() {
    var circle;
    it('should be defined by three arguments', function() {
      circle = Geoshape.circle(1, 2, 3);
      assert.deepEqual(circle, Geoshape('Circle', [2, 1], 3));
    });
    it('should be a valid object', function() {
      assert.equal(typeof circle, 'object');
      assert.deepEqual(circle, {
        type: 'Circle',
        coordinates: [2, 1],
        radius: 3
      });
    });
  });
  describe('box', function() {
    var box;
    it('should be defined by two arguments', function() {
      box = Geoshape.box(1, 2, 3, 4);
      assert.deepEqual(box, Geoshape('Polygon', [[2, 1], [4, 1], [4, 3], [2, 3]]));
    });
    it('should be a valid object', function() {
      assert.equal(typeof box, 'object');
      assert.deepEqual(box, {
        type: 'Polygon',
        coordinates: [[2, 1], [4, 1], [4, 3], [2, 3]]
      });
    });
  });
});