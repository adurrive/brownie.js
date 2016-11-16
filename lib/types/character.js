'use strict';

/**
 * CharacterType constructor
 *
 * @api public
 */
var CharacterType = (function() {
  /**
   * CharacterType class
   *
   * @api public
   */
  function CharacterType () {
    this.name = 'Character';
    this.titan = 'Character';
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
  CharacterType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {String} value String to convert to string
   * @api private
   */
  CharacterType.prototype.fromTitan = function (value) {
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
  CharacterType.prototype.toString = CharacterType.prototype.toTitan;

  /**
   * From string
   *
   * @param {String} value String to convert to string
   * @api private
   */
  CharacterType.prototype.fromString = CharacterType.prototype.fromTitan;

  /**
   * Validate character
   *
   * String with a length of one
   *
   * @param {String} value String to validate as character
   * @api private
   */
  CharacterType.prototype.validate = function (value) {
    return '[object String]' === Object.prototype.toString.call(value) && value.length === 1;
  };

  return CharacterType;

})();

module.exports = new CharacterType();