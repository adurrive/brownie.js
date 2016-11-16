'use strict';

var Script = require('./script');
var Increment = require('./increment');
var Types = require('./types/index');
var Cardinalities = require('./cardinalities/index');
var utils = require('./utils');

/**
 * PropertySchema constructor
 *
 * @api private
 */
var PropertySchema = (function () {

  /**
   * PropertySchema class
   *
   * @param {String} name Name of the property
   * @param {Object} obj Property schema to define
   * @api private
   */
  function PropertySchema (name, obj) {
    if (!(this instanceof PropertySchema)) {
      return new PropertySchema(name, obj);
    }

    if (!utils.isObject(obj)) {
      throw new Error('Invalid ' + name + ' property');
    }

    if (name[0] === '@' || utils.reserved[name]) {
      throw new Error('Reserved ' + name + ' property name');
    }

    // Type
    if (!obj.type) {
      throw new Error('Missing ' + name + ' property type');
    } 
    if (!obj.type.hasOwnProperty('name')) {
      throw new Error('Invalid ' + name + ' property type');
    }
    if (!Types[obj.type.name]) {
      throw new Error('Unknown  ' + name + ' property type ' + obj.type.name.toLowerCase());
    }
    this.type = Types[obj.type.name];

    // Cardinality
    if (obj.hasOwnProperty('cardinality')) {
      if (!obj.cardinality.hasOwnProperty('name')) {
        throw new Error('Invalid ' + name + ' property cardinality');
      }
      if (!Cardinalities[obj.cardinality.name]) {
        throw new Error('Unknown ' + name + ' property cardinality ' + obj.cardinality.name.toLowerCase());
      }
      this.cardinality = Cardinalities[obj.cardinality.name];
    } else {
      this.cardinality = Cardinalities.SINGLE;
    }

    // Increment
    if (obj.hasOwnProperty('increment')) {
      if (!(obj.increment instanceof Increment)) {
        throw new Error('Invalid ' + name + ' property increment');
      }
      if (!this.type.isNumber) {
        throw new Error('Cannot increment ' + name + ' property type ' + this.type.name.toLowerCase());
      }
      this.increment = obj.increment;
      this.locked = true;
    }

    // Script
    if (obj.hasOwnProperty('script')) {
      if (!(obj.script instanceof Script)) {
        throw new Error('Invalid ' + name + ' property script');
      }
      if (this.hasOwnProperty('increment')) {
        throw new Error('More than one default value, script or increment set in ' + name + ' property');
      }
      this.script = obj.script;
      this.locked = true;
    }

    // Value
    if (obj.hasOwnProperty('value')) {
      if (!this.type.validate(obj.value)) {
        throw new Error('Invalid value variable for ' + name + ' property');
      }
      if (this.hasOwnProperty('increment') || this.hasOwnProperty('script')) {
        throw new Error('More than one default value, script or increment set in ' + name + ' property');
      }
      this.value = this.type.toTitan(obj.value);
      this.locked = true;
    }

    // Init
    if (obj.hasOwnProperty('init')) {
      if (!this.type.validate(obj.init)) {
        throw new Error('Invalid initialization variable for ' + name + ' property');
      }
      if (this.hasOwnProperty('value')) {
        throw new Error('Properties cannot have both a default value and an initialization variable in ' + name + ' property');
      }
      this.init = this.type.toTitan(obj.init);
    }

    // Locked
    if (obj.locked) {
      this.locked = true;
    }

    // Required
    if (obj.required) {
      if (this.locked) {
        throw new Error('Locked properties cannot be required');
      }
      this.required = true;
    }

    // Pre
    if (obj.hasOwnProperty('pre')) {
      if (!(obj.pre instanceof Script)) {
        throw new Error('Invalid pre script for ' + name + ' property');
      }
      if (this.locked && !this.value && !this.script) {
        throw new Error('Locked properties cannot have pre scripts');
      }
      this.pre = obj.pre;
    }

    // Post
    if (obj.hasOwnProperty('post')) {
      if (!(obj.post instanceof Script)) {
        throw new Error('Invalid post script for ' + name + ' property');
      }
      if (this.locked && !this.value && !this.script) {
        throw new Error('Locked properties cannot have post scripts');
      }
      this.post = obj.post;
    }

    // Threshold
    if (obj.threshold) {
      if (obj.hasOwnProperty('init') && obj.init !== 0) {
        throw new Error('Threshold elements initialize at 0');
      }
      if (this.locked) {
        throw new Error('Locked properties cannot be threshold elements');
      }
      if (!this.type.isNumber) {
        throw new Error('Property type ' + this.type.name + ' not supported for threshold elements');
      }
      this.threshold = true;
      this.init = 0;
    }

    // Key
    if (obj.hasOwnProperty('key')) {
      if (obj.hasOwnProperty('init')) {
        throw new Error('Initialized properties cannot be key elements');
      }
      if (this.locked && !this.value && !this.script) {
        throw new Error('Locked properties cannot be key elements');
      }
      if (!this.type.isKey) {
        throw new Error('Property type ' + this.type.name + ' not supported for key elements');
      }
      if (isNaN(obj.key)) {
        throw new Error('Invalid key position for ' + name + ' property');
      }
      this.key = obj.key;
    }
  }

  /**
   * Get bindings
   *
   * @param {String} name Name of the property
   * @param {Property} property Property
   * @param {Boolean} get Bindings used to get versus save data from Titan
   * @param {Boolean} remove Parent item or document is being deleted
   * @api public
   */
  PropertySchema.prototype.bindings = function (name, property, get, remove) {
    var bindings, update;

    // Filter key properties for get requests
    if ((get && !this.hasOwnProperty('key')) || (remove && !this.hasOwnProperty('key') && !this.hasOwnProperty('threshold'))) {
      return null;
    }

    // Initialize
    property = property || {};
    bindings = {};

    // Get bindings
    if (!this.locked) {
      if (property.remove) {
        bindings.remove = true;
        get = true;
        update = true;
      } else if (!get && property.hasOwnProperty('increment')) {
        bindings.increment = property.increment;
        update = true;
      } else if (property.hasOwnProperty('script')) {
        bindings.script = property.script;
        update = true;
      } else if (property.hasOwnProperty('value')) {
        bindings.value = this.type.toTitan(property.value);
        update = true;
      }
    } else {
      if (!get && property.hasOwnProperty('increment')) {
        bindings.increment = this.increment;
        update = true;
      } else if (this.hasOwnProperty('script')) {
        bindings.script = this.script;
        update = true;
      } else if (this.hasOwnProperty('value')) {
        bindings.value = this.value;
        update = true;
      }
    }

    if (!get) {
      if (!update && this.required) {
        throw new Error ('Required ' + name + ' property missing');
      }

      if (!bindings.value && !bindings.remove && this.hasOwnProperty('init')) {
        bindings.init = this.init;
      }

      if (update || bindings.init) {
        if (this.hasOwnProperty('pre')) {
          bindings.pre = this.pre;
        }
        if (this.hasOwnProperty('post')) {
          bindings.post = this.post;
        }
      }
    }

    // Return bindings
    if (!Object.keys(bindings).length) {
      return null;
    }

    return bindings;
  };

  return PropertySchema;

})();

module.exports = PropertySchema;