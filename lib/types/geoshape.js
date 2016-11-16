'use strict';

var Geoshape = require('../geoshape');

/**
 * GeoshapeType constructor
 *
 * @api public
 */
var GeoshapeType = (function() {
  /**
   * GeoshapeType class
   *
   * @api public
   */
  function GeoshapeType () {
    this.name = 'Geoshape';
    this.titan = 'Geoshape';
    this.isKey = false;
    this.isNumber = false;
    this.isString = false;
  }

  /**
   * To titan
   *
   * @param {Object} value Geoshape to convert to geoshape
   * @api private
   */
  GeoshapeType.prototype.toTitan = function (value) {
    return value;
  };

  /**
   * From titan
   *
   * @param {Object} value Object to convert to geoshape
   * @api private
   */
  GeoshapeType.prototype.fromTitan = function (value) {
    if (value === null || value === undefined) {
      return null;
    }
    return new Geoshape(value.type, value.coordinates, value.radius);
  };

  /**
   * To string
   *
   * @param {Object} value Geoshape to convert to string
   * @api private
   */
  GeoshapeType.prototype.toString = function (value) {
    return JSON.stringify(value);
  };

  /**
   * From string
   *
   * @param {String} value String to convert to geoshape
   * @api private
   */
  GeoshapeType.prototype.fromString = function (value) {
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
   * Validate geoshape
   *
   * @param {Object} value Geoshape to validate as geoshape 
   * @api private
   */
  GeoshapeType.prototype.validate = function (value) {
    return value instanceof Geoshape;
  };

  return GeoshapeType;

})();

module.exports = new GeoshapeType();