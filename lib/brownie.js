'use strict';

var _ = require('lodash');
var settings = require('./settings');
var connection = require('./connection');
var models = require('./models');
var Script = require('./script');
var Increment = require('./increment');
var Geoshape = require('./geoshape');
var CompositeIndex = require('./compositeIndex');
var MixedIndex = require('./mixedIndex');
var Types = require('./types/index');
var Multiplicities = require('./multiplicities/index');
var Mappings = require('./mappings/index');
var Cardinalities = require('./cardinalities/index');
var VertexSchema = require('./vertexSchema');
var VertexModel = require('./vertexModel');
var EdgeSchema = require('./edgeSchema');
var EdgeModel = require('./edgeModel');
var Graph = require('./graph');

/**
 * Brownie constructor
 *
 * @api private
 */
var Brownie = (function() {
  /**
   * Brownie class
   *
   * The exports object of the `brownie` module is an instance of this class.
   * Most apps will only use one instance.
   *
   * @api public
   */
  function Brownie () {
    this.settings = settings.get();
    this.connection = connection;
    this.models = models;
  }

  /**
   * Connect to the gremlin server
   *
   * @param {Object} settings Settings for the `brownie` module
   *
   * @api public
   */
  Brownie.prototype.connect = function (options) {
    var self = this;

    // Set settings
    settings.set(options);

    // Create connection
    return connection.connect()
    .then(function () {
      if (self.settings.initialize) {
        return self.initialize();
      }
    });
  };

  /**
   * Define a model or retrieves it
   *
   * @param {String} label Label of the model in Titan
   * @param {VertexSchema|EdgeSchema} schema Schema of the model
   * @api public
   */
  Brownie.prototype.model = function (label, schema) {
    var model, type;

    // Check type
    if (schema instanceof VertexSchema) {
      type = 'vertex';
    } else if (schema instanceof EdgeSchema) {
      type = 'edge';
    } else {
      throw new Error('Missing schema');
    }

    // Check model
    model = this.models.get(type, label);
    if (model) { 
      if (!_.isEqual(schema, model.schema)) {
        throw new Error('A different ' + type + ' model already exists with the label ' + label);
      }
      return model; 
    }

    // Create model
    if (type === 'vertex') {
      model = VertexModel.compile(label, schema);
    } else {
      model = EdgeModel.compile(label, schema);
    }

    // Set model
    this.models.set(model);

    return model;
  };

  /**
   * Initialize all current models in Titan
   *
   * @api public
   */
  Brownie.prototype.initialize = function () {
    return this.models.initialize();
  };

  /**
   * Execute a custom script on the gremlin server
   *
   * @param {Script|String} script Script to execute
   * @param {Object} bindings Bindings available in the script
   * @api public
   */
  Brownie.prototype.execute = function (script, bindings) {
    return this.connection.execute(script, bindings);
  };

  /**
   * Directly query the Elasticsearch index through Titan
   *
   * @param {Object} params Parameters of the search
   * @api public
   */
  Brownie.prototype.query = function (params) {
    return Graph.query(params);
  };

  /**
   * Execute a custom script on the gremlin server and return a stream
   *
   * @param {Script|String} script Script to execute
   * @param {Object} bindings Bindings available in the script
   * @api public
   */
  Brownie.prototype.messageStream = function (script, bindings) {
    return this.connection.messageStream(script, bindings);
  };

  /**
   * Execute a custom script on the gremlin server and return a graph automatically inferred from the array of results
   *
   * @param {Script|String} script Script to execute
   * @param {Object} bindings Bindings available in the script
   * @api public
   */
  Brownie.prototype.messageGraph = function (script, bindings) {
    return Graph.messageGraph(script, bindings);
  };

  /**
   * Vertex Schema constructor
   *
   * @method VertexSchema
   * @api public
   */
  Brownie.prototype.VertexSchema = VertexSchema;

  /**
   * Edge Schema constructor
   *
   * @method EdgeSchema
   * @api public
   */
  Brownie.prototype.EdgeSchema = EdgeSchema;

  /**
   * Graph constructor
   *
   * @method Graph
   * @api public
   */
  Brownie.prototype.Graph = Graph;

  /**
   * Script constructor
   *
   * @method Script
   * @api public
   */
  Brownie.prototype.Script = Script;

  /**
   * Increment constructor
   *
   * @method Increment
   * @api public
   */
  Brownie.prototype.Increment = Increment;

  /**
   * Geoshape constructor
   *
   * @method Geoshape
   * @api public
   */
  Brownie.prototype.Geoshape = Geoshape;

  /**
   * CompositeIndex constructor
   *
   * @method CompositeIndex
   * @api public
   */
  Brownie.prototype.CompositeIndex = CompositeIndex;

  /**
   * MixedIndex constructor
   *
   * @method MixedIndex
   * @api public
   */
  Brownie.prototype.MixedIndex = MixedIndex;

  /**
   * Types
   *
   * @method Types
   * @api public
   */
  Brownie.prototype.Types = Types;

  /**
   * Multiplicities
   *
   * @method Multiplicities
   * @api public
   */
  Brownie.prototype.Multiplicities = Multiplicities;

  /**
   * Mappings
   *
   * @method Mappings
   * @api public
   */
  Brownie.prototype.Mappings = Mappings;

  /**
   * Cardinalities
   *
   * @method Cardinalities
   * @api public
   */
  Brownie.prototype.Cardinalities = Cardinalities;

  return Brownie;

})();
/**
 * The exports object is an instance of Brownie
 */
module.exports = new Brownie();