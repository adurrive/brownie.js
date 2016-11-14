'use strict';

/**
 * MultiMultiplicity constructor
 *
 * @api public
 */
var MultiMultiplicity = (function() {
  /**
   * MultiMultiplicity class
   *
   * Allows multiple edges of the same label between any pair of vertices. In other words, the graph is a multi graph with respect to such edge label. There is no constraint on edge multiplicity.
   *
   * @api public
   */
  function MultiMultiplicity () {
    this.name = 'MULTI';
  }

  return MultiMultiplicity;

})();

module.exports = new MultiMultiplicity();