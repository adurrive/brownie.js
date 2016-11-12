/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Multiplicities = brownie.Multiplicities;

describe('multiplicities', function() {
  Object.keys(Multiplicities).forEach(function (multiplicity) {
    it(multiplicity + ' should have a name property', function() {
      assert.equal(Multiplicities[multiplicity].hasOwnProperty('name'), true);
    });
  });
});