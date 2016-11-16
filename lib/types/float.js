'use strict';

/**
 * FloatType constructor
 *
 * @api public
 */
var FloatType = (function() {
  /**
   * FloatType class
   *
   * @api public
   */
  function FloatType () {
    this.name = 'Float';
    this.titan = 'Float';
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
  FloatType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {Number} value Number to convert to number
   * @api private
   */
  FloatType.prototype.fromTitan = function (value) {
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
  FloatType.prototype.toString = function (value) {
    return value.toString();
  };

  /**
   * From string
   *
   * @param {String} value String to convert to number
   * @api private
   */
  FloatType.prototype.fromString = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return parseFloat(value);
  };

  /**
   * Validate float
   *
   * Float between -16777216 and 16777215 included
   *
   * @param {Number} value Number to validate as float
   * @api private
   */
  FloatType.prototype.validate = function (value) {
    return '[object Number]' === Object.prototype.toString.call(value) && value >= -16777216 && value <= 16777215;
  };

  return FloatType;

})();

module.exports = new FloatType();