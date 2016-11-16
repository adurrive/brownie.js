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
   * Use a mixed index for numeric range, full-text or geo-spatial indexing. Also, using a mixed index can speed up orderBy queries.
   *
   * @param {String} name Name of the mixed index
   * @param {String} backendName Indexing backend name
   * @param {Object} keys Properties to index
   * @param {Boolean} global Define the index as global or leave it limited to the model (label)
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