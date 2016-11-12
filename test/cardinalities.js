/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Cardinalities = brownie.Cardinalities;

describe('cardinalities', function() {
  Object.keys(Cardinalities).forEach(function (cardinality) {
    it(cardinality + ' should have a name property', function() {
      assert.equal(Cardinalities[cardinality].hasOwnProperty('name'), true);
    });
  });
});