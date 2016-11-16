'use strict';

var utils = require('./utils');

/**
 * Script constructor
 *
 * @api public
 */
var Script = (function () {

  /**
   * Script class
   *
   * @param {String} script Script in groovy
   * @param {Object} bindings Bindings available in the script
   * @api public
   */
  function Script (script, bindings) {
    if (!(this instanceof Script)) {
      return new Script(script, bindings);
    }

    if (!utils.isString(script) || (bindings && !utils.isObject(bindings))) {
      throw new Error('Invalid script arguments');
    }

    this.script = utils.compressScript(script);
    this.bindings = bindings || {};
  }

  return Script;

})();

module.exports = Script;