'use strict';

/**
 * Increment constructor
 *
 * @api public
 */
var Increment = (function () {

  /**
   * Increment class
   *
   * @param {Number} value Increment value
   * @api public
   */
  function Increment (value) {
    if (!(this instanceof Increment)) {
      return new Increment(value);
    }
    
    if (isNaN(value)) {
      throw new Error('Invalid increment value');
    }

    this.value = value;
  }

  return Increment;

})();

module.exports = Increment;