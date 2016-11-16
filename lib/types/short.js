'use strict';

/**
 * ShortType constructor
 *
 * @api public
 */
var ShortType = (function() {
  /**
   * ShortType class
   *
   * @api public
   */
  function ShortType () {
    this.name = 'Short';
    this.titan = 'Short';
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
  ShortType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {Number} value Number to convert to number
   * @api private
   */
  ShortType.prototype.fromTitan = function (value) {
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
  ShortType.prototype.toString = function (value) {
    return value.toString();
  };

  /**
   * From string
   *
   * @param {String} value String to convert to number
   * @api private
   */
  ShortType.prototype.fromString = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return parseInt(value);
  };

  /**
   * Validate short
   *
   * Integer between -32768 and 32767 included
   *
   * @param {Number} value Number to validate as short
   * @api private
   */
  ShortType.prototype.validate = function (value) {
    return '[object Number]' === Object.prototype.toString.call(value) && value >= -32768 && value <= 32767 && value%1 === 0;
  };

  return ShortType;

})();

module.exports = new ShortType();