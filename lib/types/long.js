'use strict';

/**
 * LongType constructor
 *
 * @api public
 */
var LongType = (function() {
  /**
   * LongType class
   *
   * @api public
   */
  function LongType () {
    this.name = 'Long';
    this.titan = 'Long';
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
  LongType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {Number} value Number to convert to number
   * @api private
   */
  LongType.prototype.fromTitan = function (value) {
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
  LongType.prototype.toString = function (value) {
    return value.toString();
  };

  /**
   * From string
   *
   * @param {String} value String to convert to number
   * @api private
   */
  LongType.prototype.fromString = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return parseInt(value);
  };

  /**
   * Validate long
   *
   * Integer between -9007199254740992 and 9007199254740991 included
   *
   * @param {Number} value Number to validate as long
   * @api private
   */
  LongType.prototype.validate = function (value) {
    return '[object Number]' === Object.prototype.toString.call(value) && value >= -9007199254740992 && value <= 9007199254740991 && value%1 === 0;
  };

  return LongType;

})();  

module.exports = new LongType();