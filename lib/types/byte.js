'use strict';

/**
 * ByteType constructor
 *
 * @api public
 */
var ByteType = (function() {
  /**
   * ByteType class
   *
   * @api public
   */
  function ByteType () {
    this.name = 'Byte';
    this.titan = 'Byte';
    this.isKey = true;
    this.isNumber = true;
    this.isString = false;
  }
  
  /**
   * To titan
   *
   * @param {Number} value
   * @api private
   */
  ByteType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {Number} value
   * @api private
   */
  ByteType.prototype.fromTitan = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value;
  };
  
  /**
   * To string
   *
   * @param {Number} value
   * @api private
   */
  ByteType.prototype.toString = function (value) {
    return value.toString();
  };

  /**
   * From string
   *
   * @param {String} value
   * @api private
   */
  ByteType.prototype.fromString = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return parseInt(value);
  };

  /**
   * Validate
   *
   * @param {Number} value
   * @api private
   */
  ByteType.prototype.validate = function (value) {
    return '[object Number]' === Object.prototype.toString.call(value) && value >= -128 && value <= 127 && value%1 === 0;
  };

  return ByteType;

})();

module.exports = new ByteType();