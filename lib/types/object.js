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
   * @param {Object} value
   * @api private
   */
  ObjectType.prototype.toTitan = function (value) {
    return JSON.stringify(value);
  };

  /**
   * From titan
   *
   * @param {String} value
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
   * @param {Object} value
   * @api private
   */
  ObjectType.prototype.toString = ObjectType.prototype.toTitan;

  /**
   * From string
   *
   * @param {String} value
   * @api private
   */
  ObjectType.prototype.fromString = ObjectType.prototype.fromTitan;

  /**
   * Validate
   *
   * @param {Object} value
   * @api private
   */
  ObjectType.prototype.validate = function (value) {
    return '[object Object]' === Object.prototype.toString.call(value);
  };

  return ObjectType;

})();

module.exports = new ObjectType();