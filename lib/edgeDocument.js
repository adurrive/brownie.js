'use strict';

var Bluebird = require('bluebird');
var inherits = require('util').inherits;
var Document = require('./document');
var utils = require('./utils');
var Graph = require('./graph');

/**
 * EdgeDocument constructor
 *
 * @api private
 */
var EdgeDocument = (function () {

  /**
   * EdgeDocument class
   *
   * @param {Object} doc Edge document object
   * @param {Boolean} fromTitan Edge document from Titan requiring special parsing
   * @api private
   */
  function EdgeDocument (doc, fromTitan) {
    // Add out vertex
    if (doc.hasOwnProperty('outV')) {
      this.addOutV(doc.outV, doc.outVLabel);
    }

    // Add in vertex
    if (doc.hasOwnProperty('inV')) {
      this.addInV(doc.inV, doc.inVLabel);
    }

    Document.call(this, doc, fromTitan);
  }
  
  inherits(EdgeDocument, Document);

  /**
   * Add outV
   *
   * @param {VertexDocument|Number} outV Out vertex document or id
   * @param {String} outVLabel Out vertex label
   * @api public
   */
  EdgeDocument.prototype.addOutV = function (outV, outVLabel) {
    if (utils.isNumber(outV) && outVLabel) {
      if (!this.schema.outVModels[outVLabel]) {
        throw new Error('The  label ' + outVLabel + ' is not defined in the edge schema as an accepted out vertex label');
      }
      this.outV = new this.schema.outVModels[outVLabel]({ id: outV });
    } else if (outV instanceof Document) {
      if (!this.schema.outVModels[outV.label]) {
        throw new Error('The  label ' + outV.label + ' is not defined in the edge schema as an accepted out vertex label');
      }
      this.outV = outV;
    }
  };

  /**
   * Add inV
   *
   * @param {VertexDocument|Number} inV In vertex document or id
   * @param {String} inVLabel In vertex label
   * @api public
   */
  EdgeDocument.prototype.addInV = function (inV, inVLabel) {
    if (utils.isNumber(inV) && inVLabel) {
      if (!this.schema.inVModels[inVLabel]) {
        throw new Error('The label ' + inVLabel + ' is not defined in the edge schema as an accepted in vertex label');
      }
      this.inV = new this.schema.inVModels[inVLabel]({ id: inV });
    } else if (inV instanceof Document) {
      if (!this.schema.inVModels[inV.label]) {
        throw new Error('The label ' + inV.label + ' is not defined in the edge schema as an accepted in vertex label');
      }
      this.inV = inV;
    }
  };

  /**
   * Save edge document
   *
   * @param {Boolean} get Return the updated graph from Titan when successfully saved
   * @api public
   */
  EdgeDocument.prototype.save = function (get) {
    var self = this;    

    return Bluebird.resolve()
    .then(function () {
      var graph = new Graph(self);
      return graph.save(get);
    });
  };

  /**
   * Get edge document
   *
   * @api public
   */
  EdgeDocument.prototype.get = function () {
    var self = this;    

    return Bluebird.resolve()
    .then(function () {
      var graph = new Graph(self);
      return graph.get();
    });
  };

  return EdgeDocument;

})();

module.exports = EdgeDocument;