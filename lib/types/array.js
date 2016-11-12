'use strict';

/**
 * ArrayType constructor
 *
 * @api public
 */
var ArrayType = (function() {
  /**
   * ArrayType class
   *
   * @api public
   */
  function ArrayType () {
    this.name = 'Array';
    this.titan = 'String';
    this.isKey = false;
    this.isNumber = false;
    this.isString = false;
  }

  /**
   * To titan
   *
   * @param {Array} value
   * @api private
   */
  ArrayType.prototype.toTitan = function (value) {
    return JSON.stringify(value);
  };

  /**
   * From titan
   *
   * @param {String} value
   * @api private
   */
  ArrayType.prototype.fromTitan = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (err) {
      return null;
    }
  };

  /**
   * To string
   *
   * @param {Array} value
   * @api private
   */
  ArrayType.prototype.toString = ArrayType.prototype.toTitan;

  /**
   * From string
   *
   * @param {String} value
   * @api private
   */
  ArrayType.prototype.fromString = ArrayType.prototype.fromTitan;

  /**
   * Validate
   *
   * @param {Array} value
   * @api private
   */
  ArrayType.prototype.validate = function (value) {
    return Array.isArray(value);
  };

  return ArrayType;

})();

module.exports = new ArrayType();