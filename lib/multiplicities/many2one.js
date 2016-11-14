'use strict';

/**
 * Many2OneMultiplicity constructor
 *
 * @api public
 */
var Many2OneMultiplicity = (function() {
  /**
   * Many2OneMultiplicity class
   *
   * Allows at most one outgoing edge of such label on any vertex in the graph but places no constraint on incoming edges. The edge label mother is an example with MANY2ONE multiplicity since each person has at most one mother but mothers can have multiple children.
   *
   * @api public
   */
  function Many2OneMultiplicity () {
    this.name = 'MANY2ONE';
  }

  return Many2OneMultiplicity;

})();

module.exports = new Many2OneMultiplicity();