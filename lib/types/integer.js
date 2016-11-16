'use strict';

/**
 * IntegerType constructor
 *
 * @api public
 */
var IntegerType = (function() {
  /**
   * IntegerType class
   *
   * @api public
   */
  function IntegerType () {
    this.name = 'Integer';
    this.titan = 'Integer';
    this.isKey = true;
    this.isNumber = true;
    this.isString = false;
  }

  /**
   * To titan
   *
   * @param {Number} value Number to convert to number
   * @api private
   */
  IntegerType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {Number} value Number to convert to number
   * @api private
   */
  IntegerType.prototype.fromTitan = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value;
  };

  /**
   * To string
   *
   * @param {Number} value Number to convert to string
   * @api private
   */
  IntegerType.prototype.toString = function (value) {
    return value.toString();
  };

  /**
   * From string
   *
   * @param {String} value String to convert to number
   * @api private
   */
  IntegerType.prototype.fromString = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return parseInt(value);
  };

  /**
   * Validate integer
   *
   * Integer between -2147483648 and 2147483647 included
   *
   * @param {Number} value Number to validate as integer
   * @api private
   */
  IntegerType.prototype.validate = function (value) {
    return '[object Number]' === Object.prototype.toString.call(value) && value >= -2147483648 && value <= 2147483647 && value%1 === 0;
  };

  return IntegerType;

})();

module.exports = new IntegerType();