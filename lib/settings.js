'use strict';

var _ = require('lodash');

/**
 * Settings constructor
 *
 * @api private
 */
var Settings = (function() {
  /**
   * Settings class
   *
   * @api private
   */
  function Settings () {
    this.settings = {
      log: 1,
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
          session: false,
          language: 'gremlin-groovy',
          op: 'eval',
          processor: '',
          accept: 'application/json'
        }
      },
      search: {
        elementIdentifier: '$vertex$',
        offset: 0,
        limit: 10
      },
      split: '|',
      trim: true,
      initialize: false,
      strict: false
    };
  }

  /**
   * Get settings
   *
   * @param {String} name
   * @api private
   */
  Settings.prototype.get = function (name) {
    if (!name) {
      return this.settings;
    }
    return this.settings[name];
  };

  /**
   * Set settings
   *
   * @param {Object} settings
   * @api private
   */
  Settings.prototype.set = function (settings) {
    _.assign(this.settings, _.defaultsDeep(settings || {}, this.settings));
  };

  return Settings;

})();

module.exports = new Settings();