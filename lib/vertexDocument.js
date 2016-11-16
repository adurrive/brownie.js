'use strict';

var Bluebird = require('bluebird');
var inherits = require('util').inherits;
var Document = require('./document');
var Graph = require('./graph');

/**
 * VertexDocument constructor
 *
 * @api private
 */
var VertexDocument = (function () {

  /**
   * VertexDocument class
   *
   * @param {Object} doc Vertex document object
   * @param {Boolean} fromTitan Vertex document from Titan requiring special parsing
   * @api private
   */
  function VertexDocument (doc, fromTitan) {
    Document.call(this, doc, fromTitan);
  }

  inherits(VertexDocument, Document);

  /**
   * Save vertex document
   *
   * @param {Boolean} get Return the updated graph from Titan when successfully saved
   * @api public
   */
  VertexDocument.prototype.save = function (get) {
    var self = this;    

    return Bluebird.resolve()
    .then(function () {
      var graph = new Graph(self);
      return graph.save(get);
    });
  };

  /**
   * Get vertex document
   *
   * @api public
   */
  VertexDocument.prototype.get = function () {
    var self = this;    

    return Bluebird.resolve()
    .then(function () {
      var graph = new Graph(self);
      return graph.get();
    });
  };

  return VertexDocument;

})();

module.exports = VertexDocument;