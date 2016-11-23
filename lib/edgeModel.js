'use strict';

var uuid = require('uuid');
var inherits = require('util').inherits;
var EdgeDocument = require('./edgeDocument');
var utils = require('./utils');

/**
 * EdgeModel constructor
 *
 * @api public
 */
var EdgeModel = (function () {

  /**
   * EdgeModel class
   *
   * @param {String} label Label of the edge model in Titan
   * @param {EdgeSchema} schema Edge schema of the model
   * @param {Object} doc Edge document
   * @param {Boolean} fromTitan Edge document from Titan requiring special parsing
   * @api private
   */
  function EdgeModel (label, schema, doc, fromTitan) {
    if (!(this instanceof EdgeModel)) {
      return new EdgeModel(label, schema, doc, fromTitan);
    }

    if (!utils.isObject(doc)) {
      throw new Error('Invalid document');
    }

    Object.defineProperty(this, 'schema', { value: schema });

    this.uuid = doc.uuid || uuid.v4();
    this.type = 'edge';
    this.label = label;
    this.synced = fromTitan;

    EdgeDocument.call(this, doc, fromTitan);
  }

  inherits(EdgeModel, EdgeDocument);

  /**
   * Compile EdgeModel
   *
   * @param {String} label Label of the edge model in Titan
   * @param {EdgeSchema} schema Edge schema of the model
   * @api private
   */
  EdgeModel.compile = function (label, schema) {
    var method;

    function edgeModel (doc, fromTitan) {
      if (!(this instanceof edgeModel)) {
        return new edgeModel(doc, fromTitan);
      }

      doc = doc || {};
      fromTitan = !!fromTitan;

      EdgeModel.call(this, label, schema, doc, fromTitan);
    }

    inherits(edgeModel, EdgeModel);

    // Set document methods
    for (method in schema.methods) {
      if (!utils.reservedMethod[method]) {
        EdgeModel.prototype[method] = schema.methods[method];
      }
    }

    edgeModel.type = 'edge';
    edgeModel.label = label;
    edgeModel.schema = schema;
    
    return edgeModel;
  };

  return EdgeModel;

})();

module.exports = EdgeModel;