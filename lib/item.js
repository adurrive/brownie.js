'use strict';

var settings = require('./settings').get();
var PropertySchema = require('./propertySchema');
var ItemSchema = require('./itemSchema');
var Property = require('./property');
var Types = require('./types/index');
var Script = require('./script');
var utils = require('./utils');

/**
 * Item constructor
 *
 * @api private
 */
var Item = (function () {
  /**
   * Item class
   *
   * @param {ItemSchema} schema Item schema
   * @param {Object} doc Item document object
   * @param {Boolean} enableScripts Enable scripts dynamically setting the value of properties
   * @param {Boolean} fromTitan Document from Titan requiring special parsing
   * @api private
   */
  function Item (schema, doc, enableScripts, fromTitan) {
    var property;

    if (!(schema instanceof ItemSchema)) {
      throw new Error('Invalid item schema');
    }

    if (!utils.isObject(doc)) {
      throw new Error('Invalid item');
    }

    // Check item
    if (!fromTitan) {
      for (property in doc) {
        if (['id', 'key', 'script', 'properties', 'verify', 'remove'].indexOf(property) === -1) {
          throw new Error('Invalid ' + property + ' object property');
        }
      }
    }

    Object.defineProperty(this, 'schema', { value: schema });

    this.properties = {};

    // Add id
    if (doc.hasOwnProperty('id')) {
      this.addId(doc.id);
    }

    // Add key
    if (doc.hasOwnProperty('key')) {
      this.addKey(doc.key);
    } else if (doc.hasOwnProperty('value')) {
      this.addKey(doc.value);
    }

    // Add script
    if (doc.hasOwnProperty('script')) {
      this.addScript(doc.script);
    }

    // Add verify
    if (doc.hasOwnProperty('verify')) {
      this.addVerify(doc.verify);
    }

    // Delete
    if (doc.remove) {
      this.delete();
    }

    // Add properties from titan
    if (fromTitan) {
      if (doc.properties.hasOwnProperty('@updatedAt')) {
        this.updatedAt = Types.Date.fromTitan(utils.getValueFromTitan(doc.properties['@updatedAt']));
      }
      if (doc.properties.hasOwnProperty('@createdAt')) {
        this.createdAt = Types.Date.fromTitan(utils.getValueFromTitan(doc.properties['@createdAt']));
      }
    }

    // Add properties
    if (doc.hasOwnProperty('properties')) {
      this.addProperties(doc, enableScripts, fromTitan);
    }
  }

  /**
   * Add id
   *
   * @param {Number} id Id of the item in Titan
   * @api public
   */
  Item.prototype.addId = function (id) {
    if (!utils.isString(id)) {
      throw new Error('Invalid id');
    }
    this.id = id;
  };

  /**
   * Add key
   *
   * @param {String} key Key of the item
   * @api public
   */
  Item.prototype.addKey = function (key) {
    if ((this.schema.keys.length === 1 && !this.schema.properties[this.schema.keys[0]].type.validate(key)) || (this.schema.keys.length > 1 && !utils.isString(key))) {
      throw new Error('Invalid key');
    }
    this.key = key;
  };

  /**
   * Add script
   *
   * @param {Script|String} script Script to select items
   * @param {Object} bindings Bindings available in the script
   * @api public
   */
  Item.prototype.addScript = function (script, bindings) {
    if (script instanceof Script) {
      this.script = script;
    } else {
      this.script = new Script(script, bindings);
    }
  };

  /**
   * Add verify
   *
   * @param {Script|String} script Verify script, must pass to save item
   * @param {Object} bindings Bindings available in the script
   * @api public
   */
  Item.prototype.addVerify = function (script, bindings) {
    if (script instanceof Script) {
      this.verify = script;
    } else {
      this.verify = new Script(script, bindings);
    }
  };

  /**
   * Add property
   *
   * @param {String} name Name of the property
   * @param {any} value Value of the property or script if explicitly enabled
   * @param {Boolean} enableScripts Enable scripts dynamically setting the value of the property
   * @param {Boolean} fromTitan Document from Titan requiring special parsing
   * @api public
   */
  Item.prototype.addProperty = function (name, value, enableScripts, fromTitan) {
    if (this.schema.properties[name] instanceof PropertySchema) {
      if (value instanceof Property) {
        if (value.schema === this.schema.properties[name]) {
          this.properties[name] = value;
        } else {
          throw new Error('Property ' + name + ' has the wrong schema');
        }
      } else {
        this.properties[name] = new Property(this.schema.properties[name], value, enableScripts, fromTitan);
      }
      return this.properties[name];
    } else if (!fromTitan) {
      throw new Error('Unknown ' + name + ' property');
    }
  };

  /**
   * Add properties
   *
   * @param {Object} doc Item document object
   * @param {Boolean} enableScripts Enable scripts dynamically setting the value of properties
   * @param {Boolean} fromTitan Document from Titan requiring special parsing
   * @api public
   */
  Item.prototype.addProperties = function (doc, enableScripts, fromTitan) {
    var property;

    if (!utils.isObject(doc)) {
      throw new Error('Invalid document');
    }

    if (!doc.hasOwnProperty('properties')) {
      doc = { properties: doc };
    }

    for (property in doc.properties) {
      this.addProperty(property, doc.properties[property], enableScripts, fromTitan);      
    }

    return;
  };

  /**
   * Get value
   *
   * @param {String} name Name of the property or item
   * @api public
   */
  Item.prototype.value = function (name) {
    if (!this.properties.hasOwnProperty(name) || !this.properties[name].hasOwnProperty('value')) {
      return null;
    } else {
      return this.properties[name].value ;
    }
  };

  /**
   * Get values
   *
   * @api public
   */
  Item.prototype.values = function () {
    var self = this;

    return Object.keys(this.properties).reduce(function (output, property) {
      var value = self.value(property);
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
  Item.prototype.generateKey = function () {
    var self = this;

    try {
      if (this.schema.keys.length === 1) {
        // Key has property type
        if (!this.properties[this.schema.keys[0]] || !this.properties[this.schema.keys[0]].hasOwnProperty('value')) {
          throw new Error('Missing ' + this.schema.keys[0] + ' property to generate item key');
        }
        return this.schema.properties[this.schema.keys[0]].type.toTitan(this.properties[this.schema.keys[0]].value);
      } else {
        // Key has String type
        return this.schema.keys.map(function (property) {
          if (!self.properties[property] || !self.properties[property].hasOwnProperty('value')) {
            throw new Error('Missing ' + property + ' property to generate item key');
          }
          return self.schema.properties[property].type.toString(self.properties[property].value);
        }).join(settings.split);
      }
    } catch (err) {
      return null;
    }
  };

  /**
   * Get bindings
   *
   * @param {Boolean} get Bindings used to get versus save data from Titan
   * @api public
   */
  Item.prototype.bindings = function (get) {
    var self = this;
    var bindings;

    // Initialize
    bindings = {
      keys: this.schema.keys,
      properties: {}
    };
    if (this.remove) { bindings.remove = true; }
    if (this.hasOwnProperty('id')) { 
      bindings.id = this.id;
    } else if (this.script) { 
      bindings.script = this.script;
    } else {
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

    // Get bindings
    Object.keys(this.schema.properties).forEach(function (property) {
      var propertyBindings;
      propertyBindings = self.schema.properties[property].bindings(property, self.properties[property], get, bindings.remove);
      if (propertyBindings !== null) {
        bindings.properties[property] = propertyBindings;
      }
    });

    // Check key
    if (!bindings.id && !bindings.script && !bindings.key) {
      throw new Error('Item cannot be identified by key, id or script: ' + JSON.stringify(bindings, null, 2));
    }

    // Check key length
    if (bindings.key && bindings.key.toString().length > 65535) {
      throw new Error('Item key length cannot be over 65535 characters');
    }

    return bindings;
  };

  /**
   * Delete item from Titan
   *
   * @api public
   */
  Item.prototype.delete = function () { 
    this.remove = true;
  };

  return Item;

})();

module.exports = Item;