'use strict';

var utils = require('./utils');

/**
 * CompositeIndex constructor
 *
 * @api public
 */
var CompositeIndex = (function () {

  /**
   * CompositeIndex class
   *
   * Use a composite index for exact match index retrievals. Composite indexes do not require configuring or operating an external index system and are often significantly faster than mixed indexes.
   * As an exception, use a mixed index for exact matches when the number of distinct values for query constraint is relatively small or if one value is expected to be associated with many elements in the graph (i.e. in case of low selectivity).
   *
   * @param {String} name Name of the composite index
   * @param {Object} keys Properties to index
   * @param {Boolean} unique Define the index as unique
   * @param {Boolean} global Define the index as global or leave it limited to the model (label)
   * @api public
   */
  function CompositeIndex (name, keys, unique, global) {
    if (!(this instanceof CompositeIndex)) {
      return new CompositeIndex(name, keys, unique, global);
    }

    if (!utils.isString(name) || !utils.isObject(keys)) {
      throw new Error('Invalid arguments');
    }

    this.index = 'composite';
    this.name = name;
    this.keys = keys;
    this.unique = !!unique;
    this.global = !!global;
  }

  return CompositeIndex;

})();

module.exports = CompositeIndex;