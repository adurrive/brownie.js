'use strict';

/**
 * RegExpType constructor
 *
 * @api public
 */
var RegExpType = (function() {
  /**
   * RegExpType class
   *
   * @api public
   */
  function RegExpType () {
    this.name = 'RegExp';
    this.titan = 'String';
    this.isKey = false;
    this.isNumber = false;
    this.isString = false;
  }

  /**
   * To titan
   *
   * @param {RegExp} value
   * @api private
   */
  RegExpType.prototype.toTitan = function (value) {
    return value.toString();
  };

  /**
   * From titan
   *
   * @param {String} value
   * @api private
   */
  RegExpType.prototype.fromTitan = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    var re = value.match(new RegExp('^/(.*?)/([gimy]*)$'));
    return new RegExp(re[1], re[2]);
  };

  /**
   * To string
   *
   * @param {RegExp} value
   * @api private
   */
  RegExpType.prototype.toString = RegExpType.prototype.toTitan;

  /**
   * From string
   *
   * @param {String} value
   * @api private
   */
  RegExpType.prototype.fromString = RegExpType.prototype.fromTitan;

  /**
   * Validate
   *
   * @param {RegExp} value
   * @api private
   */
  RegExpType.prototype.validate = function (value) {
    return '[object RegExp]' === Object.prototype.toString.call(value);
  };

  return RegExpType;

})();

module.exports = new RegExpType();