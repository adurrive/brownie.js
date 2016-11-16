'use strict';

/**
 * UuidType constructor
 *
 * @api public
 */
var UuidType = (function() {
  /**
   * UuidType class
   *
   * @api public
   */
  function UuidType () {
    this.name = 'Uuid';
    this.titan = 'Uuid';
    this.isKey = true;
    this.isNumber = false;
    this.isString = true;
  }

  /**
   * To titan
   *
   * @param {String} value String to convert to string
   * @api private
   */
  UuidType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {String} value String to convert to string
   * @api private
   */
  UuidType.prototype.fromTitan = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value;
  };

  /**
   * To string
   *
   * @param {String} value String to convert to string
   * @api private
   */
  UuidType.prototype.toString = UuidType.prototype.toTitan;

  /**
   * From string
   *
   * @param {String} value String to convert to string
   * @api private
   */
  UuidType.prototype.fromString = UuidType.prototype.fromTitan;

  /**
   * Validate uuid
   *
   * String of 36 characters
   *
   * @param {String} value String to validate as uuid
   * @api private
   */
  UuidType.prototype.validate = function (value) {
    return '[object String]' === Object.prototype.toString.call(value) && value.length === 36;
  };

  return UuidType;

})();

module.exports = new UuidType();