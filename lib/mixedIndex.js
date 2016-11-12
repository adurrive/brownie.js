'use strict';

var Mappings = require('./mappings/index');
var utils = require('./utils');

/**
 * MixedIndex constructor
 *
 * @api public
 */
var MixedIndex = (function () {

  /**
   * MixedIndex class
   *
   * @param {String} name
   * @param {String} backendName
   * @param {Object} keys
   * @param {Boolean} global
   * @api public
   */
  function MixedIndex (name, backendName, keys, global) {
    var key;

    if (!(this instanceof MixedIndex)) {
      return new MixedIndex(name, backendName, keys, global);
    }

    if (!utils.isString(name) || !utils.isString(backendName) || !utils.isObject(keys)) {
      throw new Error('Invalid arguments');
    }

    for (key in keys) {
      key = keys[key];
      if (!utils.isObject(key) || !key.hasOwnProperty('name')) {
        throw new Error('Invalid mapping');
      }
      if (!Mappings[key.name]) {
        throw new Error('Unknown ' + key.name + ' mapping');
      }
    }

    this.index = 'mixed';
    this.name = name;
    this.backendName = backendName;
    this.keys = keys;
    this.global = !!global;
  }

  return MixedIndex;

})();

module.exports = MixedIndex;