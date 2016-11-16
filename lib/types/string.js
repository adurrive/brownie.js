'use strict';

/**
 * StringType constructor
 *
 * @api public
 */
var StringType = (function() {
  /**
   * StringType class
   *
   * @api public
   */
  function StringType () {
    this.name = 'String';
    this.titan = 'String';
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
  StringType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {String} value String to convert to string
   * @api private
   */
  StringType.prototype.fromTitan = function (value) {
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
  StringType.prototype.toString = StringType.prototype.toTitan;

  /**
   * From string
   *
   * @param {String} value String to convert to string
   * @api private
   */
  StringType.prototype.fromString = StringType.prototype.fromTitan;

  /**
   * Validate string
   *
   * @param {String} value String to validate as string
   * @api private
   */
  StringType.prototype.validate = function (value) {
    return '[object String]' === Object.prototype.toString.call(value);
  };

  return StringType;

})();

module.exports = new StringType();