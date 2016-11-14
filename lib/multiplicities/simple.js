'use strict';

/**
 * SimpleMultiplicity constructor
 *
 * @api public
 */
var SimpleMultiplicity = (function() {
  /**
   * SimpleMultiplicity class
   *
   * Allows at most one edge of such label between any pair of vertices. In other words, the graph is a simple graph with respect to the label. Ensures that edges are unique for a given label and pairs of vertices.
   *
   * @api public
   */
  function SimpleMultiplicity () {
    this.name = 'SIMPLE';
  }

  return SimpleMultiplicity;

})();

module.exports = new SimpleMultiplicity();