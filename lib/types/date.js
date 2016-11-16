'use strict';

/**
 * DateType constructor
 *
 * @api public
 */
var DateType = (function() {
  /**
   * DateType class
   *
   * @api public
   */
  function DateType () {
    this.name = 'Date';
    this.titan = 'Long';
    this.isKey = true;
    this.isNumber = true;
    this.isString = false;
  }

  /**
   * To titan
   *
   * @param {Date|Number} value
   * @api private
   */
  DateType.prototype.toTitan = function (value) {
    switch(Object.prototype.toString.call(value)) {
    case '[object Date]':
      return value.getTime();
    case '[object Number]':
      return value;
    }
  };

  /**
   * From titan
   *
   * @param {Number} value Number to convert to date
   * @api private
   */
  DateType.prototype.fromTitan = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return new Date(value);
  };

  /**
   * To string
   *
   * @param {Date|Number} value Date or number to convert to string
   * @api private
   */
  DateType.prototype.toString = function (value) {
    switch(Object.prototype.toString.call(value)) {
    case '[object Date]':
      return value.getTime().toString();
    case '[object Number]':
      return value.toString();
    }
  };

  /**
   * From string
   *
   * @param {String} value String to convert to date
   * @api private
   */
  DateType.prototype.fromString = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return new Date(parseInt(value));
  };

  /**
   * Validate date
   *
   * Date or timestamp
   *
   * @param {Date|Number} value Date or number to validate as date
   * @api private
   */
  DateType.prototype.validate = function (value) {
    var dateClass = Object.prototype.toString.call(value);
    return '[object Date]' === dateClass || ('[object Number]' === dateClass && !isNaN((new Date(value)).getTime()));
  };

  return DateType;

})();

module.exports = new DateType();