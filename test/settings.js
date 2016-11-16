/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var settings = require('../lib/settings');

describe('settings', function() {
  it('should be an object', function() {
    assert.equal(typeof settings, 'object');
  });
  it('should have a valid settings object', function() {
    assert.deepEqual(settings.settings, {
      connection: {
        port: 8182,
        host: 'localhost',
        reconnect: 10,
        reconnectInterval: 1000,
        retryOnWebSocketError: 10,
        retryOnWebSocketErrorInterval: 5000,
        retryOnUniquenessError: 10,
        retryOnUniquenessErrorInterval: 200,
        retryOnError: 1,
        retryOnErrorInterval: 1000,
        options: {
          accept: 'application/json',
          language: 'gremlin-groovy',
          op: 'eval',
          processor: '',
          session: false
        }
      },
      search: {
        elementIdentifier: '$vertex$',
        offset: 0,
        limit: 10
      },
      initialize: false,
      split: '|',
      trim: true,
      log: settings.settings.log
    });
  });
  it('should have a set method', function() {
    assert.equal(typeof settings.set, 'function');
  });
  it('should have a get method', function() {
    assert.equal(typeof settings.get, 'function');
  });
});