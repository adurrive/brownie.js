'use strict';

/**
 * BooleanType constructor
 *
 * @api public
 */
var BooleanType = (function() {
  /**
   * BooleanType class
   *
   * @api public
   */
  function BooleanType () {
    this.name = 'Boolean';
    this.titan = 'Boolean';
    this.isKey = true;
    this.isNumber = false;
    this.isString = false;
  }

  /**
   * To titan
   *
   * @param {Boolean} value Boolean to convert to boolean
   * @api private
   */
  BooleanType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {Boolean} value Boolean to convert to boolean
   * @api private
   */
  BooleanType.prototype.fromTitan = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value;
  };

  /**
   * To string
   *
   * @param {Boolean} value Boolean to convert to string
   * @api private
   */
  BooleanType.prototype.toString = function (value) {
    return value ? '1' : '0';
  };

  /**
   * From string
   *
   * @param {String} value String to convert to boolean
   * @api private
   */
  BooleanType.prototype.fromString = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value === '1';
  };

  /**
   * Validate boolean
   *
   * @param {Boolean} value Boolean to validate as boolean
   * @api private
   */
  BooleanType.prototype.validate = function (value) {
    return '[object Boolean]' === Object.prototype.toString.call(value);
  };

  return BooleanType;

})();

module.exports = new BooleanType();