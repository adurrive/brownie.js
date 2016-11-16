'use strict';

var inherits = require('util').inherits;
var Schema = require('./schema');

/**
 * VertexSchema constructor
 *
 * @api public
 */
var VertexSchema = (function () {

  /**
   * VertexSchema class
   *
   * @param {Object} obj Vertex schema to define
   * @param {Object} options Vertex schema options: duplicate, verify, indices, methods
   * @api public
   */
  function VertexSchema (obj, options) {
    if (!(this instanceof VertexSchema)) {
      return new VertexSchema(obj, options);
    }

    obj = obj || {};
    options = options || {};

    Object.defineProperty(this, 'type', { value: 'vertex' });

    Schema.call(this, obj, options);
  }

  inherits(VertexSchema, Schema);

  return VertexSchema;

})();

module.exports = VertexSchema;