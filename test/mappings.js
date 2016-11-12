/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Mappings = brownie.Mappings;

describe('mappings', function() {
  Object.keys(Mappings).forEach(function (mapping) {
    it(mapping + ' should have a name property', function() {
      assert.equal(Mappings[mapping].hasOwnProperty('name'), true);
    });
  });
});