'use strict';

var _ = require('lodash');
var settings = require('./settings').get();
var PropertySchema = require('./propertySchema');
var ItemSchema = require('./itemSchema');
var Property = require('./property');
var Item = require('./item');
var Types = require('./types/index');
var Script = require('./script');
var utils = require('./utils');

/**
 * Document constructor
 *
 * @api private
 */
var Document = (function () {

  /**
   * Document class
   *
   * @param {Object} doc
   * @param {Boolean} fromTitan
   * @api private
   */
  function Document (doc, fromTitan) {
    var property;
    
    // Check doc
    if (!fromTitan) {
      for (property in doc) {
        if (['id', 'key', 'script', 'type', 'label', 'outV', 'inV', 'properties', 'verify', 'remove'].indexOf(property) === -1) {
          throw new Error('Invalid ' + property + ' object property');
        }
      }
    }

    // Initialize properties
    this.properties = {};

    // Check type
    if (doc.hasOwnProperty('type') && doc.type !== this.type) {
      throw new Error('Invalid document type');
    }

    // Check label
    if (doc.hasOwnProperty('label') && doc.label !== this.label) {
      throw new Error('Invalid document label');
    }

    // Add id
    if (doc.hasOwnProperty('id')) {
      this.addId(doc.id);
    }

    // Add key
    if (doc.hasOwnProperty('key')) {
      this.addKey(doc.key);
    }

    // Add script
    if (doc.hasOwnProperty('script')) {
      this.addScript(doc.script);
    }

    // Add verify
    if (doc.hasOwnProperty('verify')) {
      this.addVerify(doc.verify);
    }

    // Add score
    if (doc.hasOwnProperty('score')) {
      this.addScore(doc.score);
    }

    // Delete
    if (doc.remove) {
      this.delete();
    }
    
    // Add properties from titan
    if (fromTitan) {
      if (doc.properties.hasOwnProperty('@key')) {
        this.key = Types.String.fromTitan(utils.getValueFromTitan(doc.properties['@key']));
      }
      if (doc.properties.hasOwnProperty('@updatedAt')) {
        this.updatedAt = Types.Date.fromTitan(utils.getValueFromTitan(doc.properties['@updatedAt']));
      }
      if (doc.properties.hasOwnProperty('@createdAt')) {
        this.createdAt = Types.Date.fromTitan(utils.getValueFromTitan(doc.properties['@createdAt']));
      }
    }

    // Add properties
    if (doc.hasOwnProperty('properties')) {
      this.addProperties(doc, false, fromTitan);
    }
  }

  /**
   * Add id
   *
   * @param {Number} id
   * @api public
   */
  Document.prototype.addId = function (id) {
    if ((this.type === 'vertex' && !utils.isNumber(id)) || (this.type === 'edge' && !utils.isString(id))) {
      throw new Error('Invalid id');
    }
    this.id = id;
  };

  /**
   * Add key
   *
   * @param {String} key
   * @api public
   */
  Document.prototype.addKey = function (key) {
    if (!utils.isString(key)) {
      throw new Error('Invalid key');
    }
    this.key = key;
  };

  /**
   * Add script
   *
   * @param {Script|String} script
   * @param {Object} bindings
   * @api public
   */
  Document.prototype.addScript = function (script, bindings) {
    if (script instanceof Script) {
      this.script = script;
    } else {
      this.script = new Script(script, bindings);
    }
  };

  /**
   * Add verify
   *
   * @param {Script|String} script
   * @param {Object} bindings
   * @api public
   */
  Document.prototype.addVerify = function (script, bindings) {
    if (script instanceof Script) {
      this.verify = script;
    } else {
      this.verify = new Script(script, bindings);
    }
  };

  /**
   * Add score
   *
   * @param {Number} score
   * @api public
   */
  Document.prototype.addScore = function (score) {
    if (isNaN(score)) {
      throw new Error('Invalid score');
    }
    this.score = score;
  };

  /**
   * Add property
   *
   * @param {String} name
   * @param {any} value
   * @param {Boolean} enablecripts
   * @param {Boolean} fromTitan
   * @api public
   */
  Document.prototype.addProperty = function (name, value, enablecripts, fromTitan) {
    var self = this;

    if (this.schema.properties[name] instanceof PropertySchema ) {
      if (value instanceof Property) {
        if (value.schema === this.schema.properties[name]) {
          this.properties[name] = value;
        } else {
          throw new Error('Property ' + name + ' has the wrong schema');
        }
      } else {
        this.properties[name] = new Property(this.schema.properties[name], value, enablecripts, fromTitan);
      }
      return this.properties[name];
    } else if (this.schema.properties[name] instanceof ItemSchema) {
      if (value === null || JSON.stringify(value) === '[]') {
        this.properties[name] = [];
        return; 
      }
      if (utils.isObject(value)) {
        value = [ value ];
      }
      if (!utils.isArray(value)) {
        throw new Error('Invalid ' + name + ' value');
      }
      this.properties[name] = this.properties[name] || [];
      value.forEach(function (item) {
        if (item instanceof Item) {
          if (item.schema === self.schema.properties[name]) {
            self.properties[name].push(item);
          } else {
            throw new Error('Item ' + name + ' has the wrong schema');
          }
        } else {
          self.properties[name].push(new Item(self.schema.properties[name], item, enablecripts, fromTitan));
        }
      });
      return this.properties[name][this.properties[name].length - 1];
    } else if (!fromTitan) {
      throw new Error('Unknown ' + name + ' property');
    }
  };
  
  /**
   * Add properties
   *
   * @param {Object} doc
   * @param {Boolean} enablecripts
   * @param {Boolean} fromTitan
   * @api public
   */
  Document.prototype.addProperties = function (doc, enablecripts, fromTitan) {
    var property;

    if (!utils.isObject(doc)) {
      throw new Error('Invalid document');
    }

    if (!doc.hasOwnProperty('properties')) {
      doc = { properties: doc };
    }

    for (property in doc.properties) {
      this.addProperty(property, doc.properties[property], enablecripts, fromTitan);
    }

    return;
  };

  /**
   * Get value
   *
   * @param {String} name
   * @param {Object} filter
   * @param {String} rank
   * @param {Boolean} fallback
   * @api public
   */
  Document.prototype.value = function (name, filter, rank, fallback) {
    var filtered, value;

    if (!this.properties.hasOwnProperty(name)) {
      return null;
    } else if (this.schema.properties[name] instanceof PropertySchema) {
      return this.properties[name].hasOwnProperty('value') ? this.properties[name].value : null;
    } else {
      value = this.properties[name].map(function (item) {
        return item.values();
      });
      if (!value.length) {
        return null;
      }
      if (filter) {
        filtered = _.filter(value, filter);
        if (!filtered.length && fallback) {
          filtered = value;
        }
        value = filtered;
      }
      if (rank && value.length) {
        value = value.reduce(function (prev, curr) {
          if (!prev || isNaN(prev[rank]) || isNaN(curr[rank]) || prev[rank] < curr[rank]) {
            return curr;
          } else {
            return prev;
          }
        });
      }
      return value;
    }
  };

  /**
   * Get values
   *
   * @api public
   */
  Document.prototype.values = function () {
    var self = this;

    return Object.keys(this.properties).reduce(function (output, property) {
      var value;
      value = self.value(property);
      if (value !== null) { 
        output[property] = value; 
      }
      return output;
    }, {});
  };

  /**
   * Generate key
   *
   * @api public
   */
  Document.prototype.generateKey = function () {
    var self = this;

    if (!this.schema.keys.length) {
      return null;
    } else {
      try {
        return this.schema.keys.map(function (property) {
          if (!self.properties[property] || !self.properties[property].hasOwnProperty('value')) {
            throw new Error('Missing ' + property + ' property to generate document key');
          }
          return self.schema.properties[property].type.toString(self.properties[property].value);
        }).join(settings.split);
      } catch (err) {
        return null;
      }
    }
  };

  /**
   * Get bindings
   *
   * @param {Boolean} get
   * @param {Boolean} graph
   * @api public
   */
  Document.prototype.bindings = function (get, graph) {
    var self = this;
    var bindings;

    // Initialize
    bindings = {
      uuid: this.uuid,
      label: this.label,
      type: this.type,
      keys: this.schema.keys,
      properties: {}
    };
    if (this.remove) { bindings.remove = true; }
    if (this.hasOwnProperty('id')) { 
      bindings.id = this.id; 
    } else if (this.script) { 
      bindings.script = this.script; 
    } else if (this.schema.keys.length) { 
      bindings.key = this.key || this.generateKey(); 
    }
    if (!get) {
      bindings.duplicate = this.schema.duplicate;
      bindings.thresholds = this.schema.thresholds;
      if (this.schema.verify) {
        bindings.verify = this.schema.verify;
      }
    }
    if (this.verify) {
      if (!bindings.verify) {
        bindings.verify = this.verify;
      } else {
        bindings.verify.script = '(' + bindings.verify.script + ') && (' + this.verify.script + ')';
        Object.keys(this.verify.bindings).forEach(function (key) {
          if (bindings.verify.bindings.hasOwnProperty(key)) {
            throw new Error('Binding key ' + key + ' already used in default verify script');
          }
          bindings.verify.bindings[key] = this.verify.bindings[key];
        });
      }
    }
    if (this.type === 'edge') {
      if (this.outV) {
        if (graph) {
          // Vertex has been added to graph independently
          bindings.outV = { uuid: this.outV.uuid };
        } else {
          bindings.outV = this.outV.bindings(get);
        }
      }
      if (this.inV) {
        if (graph) {
          // Vertex has been added to graph independently
          bindings.inV = { uuid: this.inV.uuid };
        } else {
          bindings.inV = this.inV.bindings(get);
        }
      }
    }

    // Get bindings
    Object.keys(this.schema.properties).forEach(function (property) {
      var propertyBindings;
      if (self.schema.properties[property] instanceof PropertySchema) {
        propertyBindings = self.schema.properties[property].bindings(property, self.properties[property], get, bindings.remove);
        if (propertyBindings !== null) {
          bindings.properties[property] = propertyBindings;
        }
      } else if (self.properties[property] !== undefined && !get && !bindings.remove) {
        propertyBindings = self.properties[property].reduce(function (output, item) {
          output.push(item.bindings(get));
          return output;
        }, []);
        bindings.properties[property] = propertyBindings;
      }
    });

    // Check id
    if (!bindings.id && !bindings.script && ((this.type === 'vertex' && !bindings.key) || (this.type === 'edge' && !bindings.outV && !bindings.inV))) {
      if (settings.log > 0) {
        console.error('Error getting bindings for document:', self);
      }
      throw new Error('Document cannot be identified by key, id or script: ' + JSON.stringify(bindings, null, 2));
    }

    return bindings;
  };

  /**
   * Remove document
   *
   * @api public
   */
  Document.prototype.delete = function () {
    this.remove = true;
  };
  
  return Document;

})();

module.exports = Document;