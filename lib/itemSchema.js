'use strict';

var PropertySchema = require('./propertySchema');
var Types = require('./types/index');
var Script = require('./script');
var Cardinalities = require('./cardinalities/index');
var utils = require('./utils');

/**
 * ItemSchema constructor
 *
 * @api public
 */
var ItemSchema = (function () {

  /**
   * ItemSchema class
   *
   * @param {Object} obj Item schema to define
   * @param {Object} options Item schema options: duplicate, verify
   * @api public
   */
  function ItemSchema (obj, options) {
    var k, property;

    options = options || {};
    
    if (!(this instanceof ItemSchema)) {
      return new ItemSchema(obj);
    }

    if (!utils.isObject(obj)) {
      throw new Error('Invalid item schema');
    }

    this.keys = [];
    this.thresholds = [];
    this.properties = {};
    
    // Properties
    for (property in obj) {
      this.properties[property] = new PropertySchema(property, obj[property]);
      // Key
      if (obj[property].hasOwnProperty('key')) {
        if (isNaN(obj[property].key)) {
          throw new Error('Invalid key position for ' + property + ' property');
        }
        this.keys[this.properties[property].key] = property;
      }
      // Threshold
      if (obj[property].threshold) {
        this.thresholds.push(property);
      }
    }

    // Check key
    for (k = 0; k < this.keys.length; k++) {
      if (this.keys[k] === undefined) {
        throw new Error('Missing key element ' + k);
      }
    }
    if (!this.keys.length) {
      throw new Error('Undefined key');
    }

    // Type
    if (this.keys.length > 1) {
      this.type = Types.String;
    } else {
      this.type = this.properties[this.keys[0]].type;
    }

    // Duplicate and cardinality
    if (options.duplicate) {
      this.duplicate = true;
      this.cardinality = Cardinalities.LIST;
    } else {
      this.duplicate = false;
      this.cardinality = Cardinalities.SET;
    }

    // Optional verify
    if (options.hasOwnProperty('verify')) {
      this.addVerify(options.verify);
    }
  }

  /**
   * Add verify
   *
   * @param {Script|String} script Verify script, must pass to save item
   * @param {Object} bindings Bindings available in the script
   * @api private
   */
  ItemSchema.prototype.addVerify = function (script, bindings) {
    if (script instanceof Script) {
      this.verify = script;
    } else {
      this.verify = new Script(script, bindings);
    }
  };

  return ItemSchema;

})();

module.exports = ItemSchema;