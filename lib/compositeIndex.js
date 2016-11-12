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
   * @param {String} name
   * @param {Object} keys
   * @param {Boolean} unique
   * @param {Boolean} global 
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