'use strict';

/**
 * ObjectType constructor
 *
 * @api public
 */
var ObjectType = (function() {
  /**
   * ObjectType class
   *
   * @api public
   */
  function ObjectType () {
    this.name = 'Object';
    this.titan = 'String';
    this.isKey = false;
    this.isNumber = false;
    this.isString = false;
  }

  /**
   * To titan
   *
   * @param {Object} value Object to convert to string
   * @api private
   */
  ObjectType.prototype.toTitan = function (value) {
    return JSON.stringify(value);
  };

  /**
   * From titan
   *
   * @param {String} value String to convert to object
   * @api private
   */
  ObjectType.prototype.fromTitan = function (value) {
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
   * @param {Object} value Object to convert to string
   * @api private
   */
  ObjectType.prototype.toString = ObjectType.prototype.toTitan;

  /**
   * From string
   *
   * @param {String} value String to convert to object
   * @api private
   */
  ObjectType.prototype.fromString = ObjectType.prototype.fromTitan;

  /**
   * Validate object
   *
   * @param {Object} value Object to validate as object
   * @api private
   */
  ObjectType.prototype.validate = function (value) {
    return '[object Object]' === Object.prototype.toString.call(value);
  };

  return ObjectType;

})();

module.exports = new ObjectType();