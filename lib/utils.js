'use strict';

var Bluebird = require('bluebird');

/**
 * Delay
 *
 * @param {Number} delay Delay to wait in ms
 * @api private
 */
exports.delay = function (ms) {
  var deferred = Bluebird.pending();
  setTimeout(function () {
    deferred.resolve();
  }, ms);
  return deferred.promise;
};

/**
 * Determines if `arg` is an object
 *
 * @param {any} arg Element to check
 * @api private
 */
exports.isObject = function (arg) {
  return '[object Object]' === Object.prototype.toString.call(arg);
};

/**
 * Determines if `arg` is an array
 *
 * @param {any} arg Element to check
 * @api private
 */
exports.isArray = function (arg) {
  return Array.isArray(arg);
};

/**
 * Determines if `arg` is a function
 *
 * @param {any} arg Element to check
 * @api private
 */
exports.isFunction = function (arg) {
  return '[object Function]' === Object.prototype.toString.call(arg);
};

/**
 * Determines if `arg` is a string
 *
 * @param {any} arg Element to check
 * @api private
 */
exports.isString = function (arg) {
  return '[object String]' === Object.prototype.toString.call(arg);
};

/**
 * Determines if `arg` is a number
 *
 * @param {any} arg Element to check
 * @api private
 */
exports.isNumber = function (arg) {
  return '[object Number]' === Object.prototype.toString.call(arg);
};

/**
 * Determines if `arg` is a model
 *
 * @param {any} arg Element to check
 * @api private
 */
exports.isModel = function (arg) {
  return this.isFunction(arg) && this.isObject(arg.schema) && arg.hasOwnProperty('label');
};

/**
 * Get value from titan property
 *
 * @param {any} value Value or titan property
 * @api private
 */
exports.getValueFromTitan = function (value) {
  if (this.isArray(value) && this.isObject(value[0]) && value[0].hasOwnProperty('id') && value[0].hasOwnProperty('value')) {
    return value[0].value;
  } else {
    return value;
  }
};

/**
 * Compress script by removing comments and multiple white spaces
 *
 * @param {String} script String to compress
 * @api private
 */
exports.compressScript = function (script) {
  return script.replace(/(\n\s*)?((\/\*([\s\S]*?)\*\/)|(\/\/(.*)$))/gm, '').replace(/\s*\n\s*/g, '\n').trim();
};

/**
 * Reserved property names
 *
 * @api private
 */
exports.reserved = {};
this.reserved.updatedAt =
this.reserved.createdAt =
this.reserved.outV =
this.reserved.inV =
this.reserved.key =
this.reserved.label =
this.reserved.score =
this.reserved.property =
this.reserved.properties = true;

/**
 * Reserved method names
 *
 * @api private
 */
exports.reservedMethod = {};
this.reservedMethod.updatedAt =
this.reservedMethod.createdAt =
this.reservedMethod.outV =
this.reservedMethod.inV =
this.reservedMethod.key =
this.reservedMethod.keys =
this.reservedMethod.score =
this.reservedMethod.thresholds =
this.reservedMethod.label =
this.reservedMethod.property =
this.reservedMethod.properties =
this.reservedMethod.type =
this.reservedMethod.schema =
this.reservedMethod.uuid =
this.reservedMethod.synced =
this.reservedMethod.id =
this.reservedMethod.script =
this.reservedMethod.verify =
this.reservedMethod.get =
this.reservedMethod.save =
this.reservedMethod.query =
this.reservedMethod.messageGraph =
this.reservedMethod.add =
this.reservedMethod.first =
this.reservedMethod.forEach =
this.reservedMethod.find =
this.reservedMethod.findAll =
this.reservedMethod.isEmpty =
this.reservedMethod.addId =
this.reservedMethod.addKey =
this.reservedMethod.addScript =
this.reservedMethod.addVerify =
this.reservedMethod.addInV =
this.reservedMethod.addOutV =
this.reservedMethod.addProperty =
this.reservedMethod.addProperties =
this.reservedMethod.value =
this.reservedMethod.values =
this.reservedMethod.generateKey =
this.reservedMethod.bindings =
this.reservedMethod.delete = true;

/**
 * Global properties
 *
 * @api private
 */
exports.global = {};
this.global['@updatedAt'] =
this.global['@createdAt'] =
this.global['@outV'] =
this.global['@inV'] =
this.global['@key'] =
this.global['@label'] = true;