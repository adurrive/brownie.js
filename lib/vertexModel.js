'use strict';

var uuid = require('uuid');
var inherits = require('util').inherits;
var VertexDocument = require('./vertexDocument');
var utils = require('./utils');

/**
 * VertexModel constructor
 *
 * @api public
 */
var VertexModel = (function () {

  /**
   * VertexModel class
   *
   * @param {String} label Label of the vertex model in Titan
   * @param {VertexSchema} schema Vertex schema of the model
   * @param {Object} doc Vertex document
   * @param {Boolean} fromTitan Vertex document from Titan requiring special parsing
   * @api private
   */
  function VertexModel (label, schema, doc, fromTitan) {
    if (!(this instanceof VertexModel)) {
      return new VertexModel(label, schema, doc, fromTitan);
    }

    if (!utils.isObject(doc)) {
      throw new Error('Invalid document');
    }

    Object.defineProperty(this, 'schema', { value: schema });

    this.uuid = doc.uuid || uuid.v4();
    this.type = 'vertex';
    this.label = label;
    this.synced = fromTitan;

    VertexDocument.call(this, doc, fromTitan);
  }

  inherits(VertexModel, VertexDocument);

  /**
   * Compile VertexModel
   *
   * @param {String} label Label of the vertex model in Titan
   * @param {VertexSchema} schema Vertex schema of the model
   * @api private
   */
  VertexModel.compile = function (label, schema) {
    var method;

    function vertexModel (doc, fromTitan) {
      if (!(this instanceof vertexModel)) {
        return new vertexModel(doc, fromTitan);
      }

      doc = doc || {};
      fromTitan = !!fromTitan;

      VertexModel.call(this, label, schema, doc, fromTitan);
    }

    inherits(vertexModel, VertexModel);

    // Set document methods
    for (method in schema.methods) {
      if (!utils.reservedMethod[method]) {
        VertexModel.prototype[method] = schema.methods[method];
      }
    }

    vertexModel.type = 'vertex';
    vertexModel.label = label;
    vertexModel.schema = schema;
    
    return vertexModel;
  };

  return VertexModel;

})();

module.exports = VertexModel;