'use strict';

var connection = require('./connection');
var scripts = require('./scripts');
var utils = require('./utils');

/**
 * Models constructor
 *
 * @api private
 */
var Models = (function() {
  /**
   * Models class
   *
   * @api private
   */
  function Models () {
    this.vertices = {};
    this.edges = {};
  }

  /**
   * Get model
   *
   * @param {String} label Label of the model in Titan
   * @api private
   */
  Models.prototype.get = function (type, label) {
    type = (type === 'edge') ? 'edges' : 'vertices';
    if (!label) {
      return this[type];
    }
    return this[type][label];
  };

  /**
   * Set model
   *
   * @param {Function} model Model
   * @api private
   */
  Models.prototype.set = function (model) {
    var type = (model.type === 'edge') ? 'edges' : 'vertices';
    if (!utils.isModel(model)) {
      throw new Error('Invalid model');
    }
    this[type][model.label] = model;
  };

  /**
   * Get bindings
   *
   * @api private
   */
  Models.prototype.bindings = function () {
    var self = this;
    var bindings;
    bindings = {
      vertices: Object.keys(this.vertices).reduce(function (output, label) {
        output[label] = {
          type: self.vertices[label].type,
          label: self.vertices[label].label,
          schema: self.vertices[label].schema
        };
        return output;
      }, {}),
      edges: Object.keys(this.edges).reduce(function (output, label) {
        output[label] = {
          type: self.edges[label].type,
          label: self.edges[label].label,
          schema: self.edges[label].schema
        };
        return output;
      }, {})
    };
    return bindings;
  };

  /**
   * Initialize all current models in Titan
   *
   * @api public
   */
  Models.prototype.initialize = function () {
    return connection.execute(scripts.init, this.bindings());
  };

  /**
   * Delete all current models from Brownie
   *
   * @api private
   */
  Models.prototype.reset = function () {
    this.vertices = {};
    this.edges = {};
  };

  return Models;

})();

module.exports = new Models();