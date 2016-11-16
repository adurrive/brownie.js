'use strict';

var PropertySchema = require('./propertySchema');
var ItemSchema = require('./itemSchema');
var CompositeIndex = require('./compositeIndex');
var MixedIndex = require('./mixedIndex');
var Script = require('./script');
var utils = require('./utils');

/**
 * Schema constructor
 *
 * @api private
 */
var Schema = (function () {

  /**
   * Schema class
   *
   * @param {Object} obj The schema to define
   * @param {Object} options Schema options: duplicate, verify, indices, methods
   * @api private
   */
  function Schema (obj, options) {
    var i, k, method, property;

    if (!utils.isObject(obj)) {
      throw new Error('Invalid schema');
    }

    this.keys = [];
    this.thresholds = [];
    this.properties = {};
    this.indices = [];
    this.methods = {};

    // Properties
    for (property in obj) {
      if (utils.isArray(obj[property])) {
        if (this.type !== 'vertex') {
          throw new Error('Invalid edge schema');
        }
        this.properties[property] = new ItemSchema(obj[property][0],obj[property][1]);
      } else {
        this.properties[property] = new PropertySchema(property, obj[property]);
        // Key
        if (obj[property].hasOwnProperty('key')) {
          this.keys[obj[property].key] = property;
        }
        // Threshold
        if (obj[property].threshold) {
          this.thresholds.push(property);
        }
      }
    }

    // Check key
    for (k = 0; k < this.keys.length; k++) {
      if (this.keys[k] === undefined) {
        throw new Error('Missing key element ' + k);
      }
    }

    // Duplicate
    if (options.duplicate) {
      if (this.keys.length !== 0) {
        throw new Error('Elements cannot have duplicate keys');
      }
      this.duplicate = true;
    } else {
      this.duplicate = false;
    }

    // Optional verify
    if (options.hasOwnProperty('verify')) {
      this.addVerify(options.verify);
    }

    // Optional indices
    if (options.hasOwnProperty('indices')) {
      if (!utils.isArray(options.indices)) {
        throw new Error('Indices must be an array');
      }
      for (i = 0; i < options.indices.length; i++) {
        this.addIndex(options.indices[i]);
      }
    }

    // Optional methods
    if (options.hasOwnProperty('methods')) {
      if (!utils.isObject(options.methods)) {
        throw new Error('Methods must be an object');
      }
      for (method in options.methods) {
        this.addMethod(method, options.methods[method]);
      }
    }
  }

  /**
   * Add verify
   *
   * @param {Script|String} script Verify script, must pass to get or save document
   * @param {Object} bindings Bindings available in the script
   * @api private
   */
  Schema.prototype.addVerify = function (script, bindings) {
    if (script instanceof Script) {
      this.verify = script;
    } else {
      this.verify = new Script(script, bindings);
    }
  };

  /**
   * Add index
   *
   * @param {CompositeIndex|MixedIndex} index Composite or mixed index
   * @api private
   */
  Schema.prototype.addIndex = function (index) {
    var key;
    if (!(index instanceof CompositeIndex) && !(index instanceof MixedIndex)) {
      throw new Error('Invalid index');
    }
    if (index.type === 'composite' && !index.unique && this.type === 'edge') {
      throw new Error('Unique indices can only be created on vertices');
    }
    for (key in index.keys) {
      if (!this.properties.hasOwnProperty(key) && !utils.global[key]) {
        throw new Error('Unknown ' + key + ' index key');
      }
    }
    this.indices.push(index);
  };

  /**
   * Add method
   *
   * @param {String} name Name of the method
   * @param {Function} method Method
   * @api private
   */
  Schema.prototype.addMethod = function (name, method) {
    if (!utils.isString(name) || !utils.isFunction(method)) {
      throw new Error('Invalid method');
    }
    if (utils.reservedMethod[name]) {
      throw new Error('Reserved method name');
    }
    this.methods[name] = method;
  };

  return Schema;

})();

module.exports = Schema;