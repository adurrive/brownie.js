'use strict';

var inherits = require('util').inherits;
var Schema = require('./schema');
var Multiplicities = require('./multiplicities/index');
var utils = require('./utils');

/**
 * EdgeSchema constructor
 *
 * @api public
 */
var EdgeSchema = (function () {

  /**
   * EdgeSchema class
   *
   * @param {Array} outVModels Allowed out vertex models
   * @param {Array} inVModels Allowed out vertex models
   * @param {Object} obj Edge schema to define
   * @param {Object} options Edge schema options: multiplicity, duplicate, verify, indices, methods
   * @api public
   */
  function EdgeSchema (outVModels, inVModels, obj, options) {
    var self = this;

    outVModels = outVModels || [];
    inVModels = inVModels || [];
    obj = obj || {};
    options = options || {};

    if (!(this instanceof EdgeSchema)) {
      return new EdgeSchema(outVModels, inVModels, obj, options);
    }

    if (!utils.isArray(outVModels) || !utils.isArray(inVModels)) {
      throw new Error('Invalid in or out vertex models');
    }

    this.outVModels = {};
    outVModels.forEach(function (model) {
      if (!utils.isFunction(model) || !model.schema || model.type !== 'vertex') {
        throw new Error('Invalid out model');
      }
      self.outVModels[model.label] = model;
    });
    
    this.inVModels = {};
    inVModels.forEach(function (model) {
      if (!utils.isFunction(model) || !model.schema || model.type !== 'vertex') {
        throw new Error('Invalid out model');
      }
      self.inVModels[model.label] = model;
    });

    if (options.hasOwnProperty('multiplicity')) {
      if (!utils.isObject(options.multiplicity) || !options.multiplicity.hasOwnProperty('name')) {
        throw new Error('Invalid multiplicity');
      }
      if (!Multiplicities[options.multiplicity.name]) {
        throw new Error('Unknown ' + options.multiplicity.name + ' multiplicity');
      }
      if (options.duplicate) {
        throw new Error('Multiplicity of duplicate edges must be MULTI');
      }
      this.multiplicity = options.multiplicity;
    } else {
      this.multiplicity = Multiplicities.MULTI;
    }

    Object.defineProperty(this, 'type', { value: 'edge' });

    Schema.call(this, obj, options);
  }

  inherits(EdgeSchema, Schema);

  return EdgeSchema;

})();

module.exports = EdgeSchema;