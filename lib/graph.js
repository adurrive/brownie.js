'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');
var settings = require('./settings').get();
var connection = require('./connection');
var models = require('./models');
var scripts = require('./scripts');
var utils = require('./utils');
var Document = require('./document');

/**
 * Graph constructor
 *
 * @api public
 */
var Graph = (function () {

  /**
   * Graph class
   *
   * @param {VertexDocument|EdgeDocument|Graph|Object|Array} element Element to add to the graph
   * @param {Boolean} fromTitan Documents from Titan requiring special parsing
   * @api private
   */
  function Graph (element, fromTitan) {
    if (!(this instanceof Graph)) {
      return new Graph(element, fromTitan);
    }

    this.graph = {};
  
    if (element) {
      this.add(element, fromTitan);
    }
  }

  /**
   * Add element to the graph
   *
   * @param {VertexDocument|EdgeDocument|Graph|Object|Array} element Element to add to the graph
   * @param {Boolean} fromTitan Documents from Titan requiring special parsing
   * @api public
   */
  Graph.prototype.add = function (element, fromTitan) {
    var doc, i, model;

    // No document
    if (!element) {
      return;
    }

    // Single Document
    if (element instanceof Document) {
      if (!this.graph[element.uuid]) {
        if (element.type === 'edge' && !fromTitan) {
          if (element.outV) {
            this.add(element.outV);
          }
          if (element.inV) {
            this.add(element.inV);
          }
        }
        this.graph[element.uuid] = element;
      }
      return this.graph[element.uuid];
    }

    // Graph
    if (element instanceof Graph) {
      for (doc in element.graph) {
        this.add(element.graph[doc]);
      }
      return;
    }

    // Array of elements
    if (utils.isArray(element)) {
      for (i = 0; i < element.length; i++) {
        this.add(element[i], fromTitan);
      }
      return;
    }

    // Single document from fromTitan
    if (fromTitan) {
      model = models.get(element.type, element.label);
      if (model) {
        return this.add(model(element, true), fromTitan);
      } else {
        throw new Error('Unknown ' + element.label + ' label');
      }
    }

    throw new Error('Invalid vertex or edge document'); 
  };

  /**
   * Get the first document of the local graph
   *
   * @param {String} type Filter by type: vertex or edge
   * @param {String} label Filter by label
   * @api public
   */
  Graph.prototype.first = function (type, label) {
    var expr;

    expr = {};
    if (type) { expr.type = type; }
    if (label) { expr.label = label; }

    return this.find(expr);
  };

  /**
   * Call function on each document of the local graph
   *
   * @param {Function} callback Function to call on each document of the graph
   * @api public
   */
  Graph.prototype.forEach = function (callback) {
    var self = this;
    
    Object.keys(this.graph).forEach(function (uuid) {
      callback(self.graph[uuid]);
    });
  };

  /**
   * Find document in local graph
   *
   * @param {Object} expr Find the first document matching this expression
   * @api public
   */
  Graph.prototype.find = function (expr) {
    var self = this;
    var uuid;

    if (expr && !utils.isObject(expr)) {
      throw new Error('Wrong argument');
    }

    uuid = _.findKey(self.graph, expr);

    return uuid ? this.graph[uuid] : null;
  };

  /**
   * Find documents in local graph
   *
   * @param {Object} expr Find all documents matching this expression
   * @api public
   */
  Graph.prototype.findAll = function (expr) {
    var self = this;

    if (expr && !utils.isObject(expr)) {
      throw new Error('Wrong argument');
    }

    return _.filter(Object.keys(this.graph).map(function (uuid) { return self.graph[uuid]; }), expr);
  };

  /**
   * Check if the local graph is empty
   *
   * @api public
   */
  Graph.prototype.isEmpty = function () {
    return !Object.keys(this.graph).length;
  };

  /**
   * Delete documents from local graph
   *
   * @param {String|Object} doc Uuid or expression to find documents
   * @api public
   */
  Graph.prototype.delete = function (doc) {
    var self = this;
    var docs;
    
    // Uuid
    if (utils.isString(doc)) {
      if (!this.graph[doc]) {
        return false;
      }
      delete this.graph[doc];
      return true;
    }

    // Expression
    if (utils.isObject(doc)) {
      docs = this.findAll(doc);
      if (!docs.length) {
        return false;
      }
      docs.forEach(function (doc) {
        delete self.graph[doc.uuid];
      });
      return true;
    }

    throw new Error('Wrong argument');
  };

  /**
   * Get bindings
   *
   * @param {Boolean} get Bindings used to get versus save data from Titan
   * @api public
   */
  Graph.prototype.bindings = function (get) {
    var self = this;
    var graph;

    graph = Object.keys(this.graph).reduce(function (output, uuid) {
      output[uuid] = self.graph[uuid].bindings(get, true);
      return output;
    }, {});

    // Return graph bindings
    if (!Object.keys(graph).length) {
      return null;
    }
    return graph;
  };

  /**
   * Save graph
   *
   * @param {Boolean} get Return the updated graph from Titan when successfully saved
   * @api public
   */
  Graph.prototype.save = function (get) {
    var graph;

    graph = this.bindings();

    if (!graph) {
      return Bluebird.resolve(null);
    }

    return connection.execute(scripts.save, { graph: graph, settings: { split: settings.split, get: !!get } })
    .then(function (results) {
      if (get && results) {
        return new Graph(results, true);
      }
      return null;
    });
  };

  /**
   * Get graph
   *
   * @api public
   */
  Graph.prototype.get = function () {
    var graph;

    graph = this.bindings(true);

    if (!graph) {
      return Bluebird.resolve(null);
    }

    return connection.execute(scripts.get, { graph: graph })
    .then(function (results) {
      if (results) {
        return new Graph(results, true);
      }
      return null;
    });
  };

  /**
   * Query direct index
   *
   * @param {Object} params Search parameters: elementIdentifier, index, field, query, filter, offset and limit
   * @api private
   */
  Graph.query = function (params) {
    if (!utils.isObject(params) || !params.index || !params.field) {
      return Bluebird.reject('Missing index or field parameters');
    }

    // Set defaults
    params.elementIdentifier = params.elementIdentifier || settings.search.elementIdentifier;
    params.query = params.query ? params.query.trim() : '';
    params.filter = params.filter ? ' ' + params.filter.trim() : '';
    params.offset = params.offset || settings.search.offset;
    params.limit = params.limit || settings.search.limit;

    if (params.query.indexOf(params.elementIdentifier) > -1) {
      return Bluebird.reject('Query conflicts with element identifier');
    }

    return connection.execute(scripts.search, params)
    .then(function (results) {
      if (results.length) {
        results = results.map(function (result) {
          var doc = result.document;
          doc.score = result.score;
          return doc;
        });
        return new Graph(results, true);
      }
      return null;
    });
  };

  Graph.prototype.query = Graph.query;

  /**
   * Message graph
   *
   * @param {String|Script} script Script to execute
   * @param {Object} bindings Bindings available in the script
   * @api public
   */
  Graph.messageGraph = function (script, bindings) {
    return connection.execute(script, bindings)
    .then(function (results) {
      if (!utils.isArray(results) || (results.length && (!utils.isObject(results[0]) || !utils.isObject(results[0].properties) || !results[0].hasOwnProperty('label') || !results[0].hasOwnProperty('id')))) {
        throw new Error('Expecting array of results');
      }
      if (results.length) {
        return new Graph(results, true);
      }
      return null;
    });
  };

  Graph.prototype.messageGraph = Graph.messageGraph;

  return Graph;

})();

module.exports = Graph;