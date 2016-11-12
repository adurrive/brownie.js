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
   * @param {Object} doc
   * @param {Boolean} fromTitan
   * @api private
   */
  function VertexDocument (doc, fromTitan) {
    Document.call(this, doc, fromTitan);
  }

  inherits(VertexDocument, Document);

  /**
   * Save vertex document
   *
   * @param {Boolean} get
   * @param {Objects} options
   * @api public
   */
  VertexDocument.prototype.save = function (get, options) {
    var self = this;    

    return Bluebird.resolve()
    .then(function () {
      var graph = new Graph(self);
      return graph.save(get, options);
    });
  };

  /**
   * Get vertex document
   *
   * @param {Objects} options
   * @api public
   */
  VertexDocument.prototype.get = function (options) {
    var self = this;    

    return Bluebird.resolve()
    .then(function () {
      var graph = new Graph(self);
      return graph.get(options);
    });
  };

  return VertexDocument;

})();

module.exports = VertexDocument;