'use strict';

/**
 * DoubleType constructor
 *
 * @api public
 */
var DoubleType = (function() {
  /**
   * DoubleType class
   *
   * @api public
   */
  function DoubleType () {
    this.name = 'Double';
    this.titan = 'Double';
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
  DoubleType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {Number} value Number to convert to number
   * @api private
   */
  DoubleType.prototype.fromTitan = function (value) {
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
  DoubleType.prototype.toString = function (value) {
    return value.toString();
  };

  /**
   * From string
   *
   * @param {String} value String to convert to number
   * @api private
   */
  DoubleType.prototype.fromString = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return parseFloat(value);
  };

  /**
   * Validate double
   *
   * Float between -9007199254740992 and 9007199254740991 included
   *
   * @param {Number} value Number to validate as double
   * @api private
   */
  DoubleType.prototype.validate = function (value) {
    return '[object Number]' === Object.prototype.toString.call(value) && value >= -9007199254740992 && value <= 9007199254740991;
  };

  return DoubleType;

})();

module.exports = new DoubleType();