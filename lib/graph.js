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
   * @param {VertexDocument|EdgeDocument|Object|Array} element
   * @param {Boolean} fromTitan
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
   * Add element
   *
   * @param {Document|Object|Array} element
   * @param {Boolean} fromTitan
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
   * Get first element of graph
   *
   * @param {String} type
   * @param {String} label
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
   * Call function on each document
   *
   * @param {Function} callback
   * @api public
   */
  Graph.prototype.forEach = function (callback) {
    var self = this;
    
    Object.keys(this.graph).forEach(function (uuid) {
      callback(self.graph[uuid]);
    });
  };

  /**
   * Find element in graph
   *
   * @param {Object} expr
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
   * Find elements in graph
   *
   * @param {Object} expr
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
   * Empty
   *
   * @api public
   */
  Graph.prototype.isEmpty = function () {
    return !Object.keys(this.graph).length;
  };

  /**
   * Delete element in graph
   *
   * @param {String|Object} element
   * @api public
   */
  Graph.prototype.delete = function (element) {
    var self = this;
    var docs;
    
    // Uuid
    if (utils.isString(element)) {
      if (!this.graph[element]) {
        return false;
      }
      delete this.graph[element];
      return true;
    }

    // Expression
    if (utils.isObject(element)) {
      docs = this.findAll(element);
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
   * @param {Boolean} get
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
   * @param {Boolean} get
   * @param {Objects} options
   * @api public
   */
  Graph.prototype.save = function (get, options) {
    var graph;

    if (options && !utils.isObject(options)) {
      return Bluebird.reject('Invalid options');
    }

    options = _.defaults(options || {}, { split: settings.split, strict: settings.strict, get: !!get });
    graph = this.bindings();

    if (!graph) {
      return Bluebird.resolve(null);
    }

    return connection.execute(scripts.save, { graph: graph, settings: options })
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
   * @param {Object} params
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
   * @param {String|Script} script
   * @param {Object} bindings
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