'use strict';

var settings = require('./settings').get();
var PropertySchema = require('./propertySchema');
var Script = require('./script');
var Increment = require('./increment');
var utils = require('./utils');

/**
 * Property constructor
 *
 * @api private
 */
var Property = (function () {
  /**
   * Property class
   *
   * @param {PropertySchema} schema 
   * @param {any} value the value or script of the property
   * @param {Boolean} enablecripts
   * @param {Boolean} fromTitan
   * @api private
   */
  function Property (schema, value, enablecripts, fromTitan) {
    if (!(schema instanceof PropertySchema)) {
      throw new Error('Invalid property schema');
    }

    Object.defineProperty(this, 'schema', { value: schema });

    if (!fromTitan && this.schema.locked) {
      throw new Error('Locked property');
    }
    if (value instanceof Increment) {
      if (this.schema.type.isNumber) {
        this.increment = value;
      } else {
        throw new Error('Cannot increment ' + this.schema.type.name.toLowerCase() + ' property type');
      }
    } else if (value instanceof Script) {
      if (enablecripts) {
        this.script = value;
      } else {
        throw new Error('Scripts need to be enabled explicitly');
      }
    } else if (value !== undefined) {
      if (value === null) {
        if (!fromTitan) { 
          this.delete(true); 
        }
      } else {
        if (fromTitan) {
          value = this.schema.type.fromTitan(utils.getValueFromTitan(value));
        } else {
          if (!this.schema.type.validate(value)) {
            throw new Error('Invalid ' + this.schema.type.name.toLowerCase() + ' property type for ' + value);
          }
          if (this.schema.type.isString && settings.trim) {
            value = value.trim();
          }
        }
        this.value = value;
      }
    }
  }

  /**
   * Remove
   *
   * @param {Boolean} force
   * @api public
   */
  Property.prototype.delete = function (force) {
    if (!force && this.schema.required) {
      throw new Error('Required property, delete with force');
    }

    if (!force && this.schema.locked) {
      throw new Error('Locked property, delete with force');
    }

    if (this.schema.key) {
      throw new Error('Key property, cannot be deleted');
    }

    if (this.schema.threshold) {
      throw new Error('Threshold property, cannot be deleted and should instead be reinitialized to 0');
    }

    delete this.increment;
    delete this.script;
    delete this.value;

    this.remove = true;
  };

  return Property;

})();

module.exports = Property;