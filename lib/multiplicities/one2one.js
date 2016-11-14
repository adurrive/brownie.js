'use strict';

/**
 * One2OneMultiplicity constructor
 *
 * @api public
 */
var One2OneMultiplicity = (function() {
  /**
   * One2OneMultiplicity class
   *
   * Allows at most one incoming and one outgoing edge of such label on any vertex in the graph. The edge label marriedTo is an example with ONE2ONE multiplicity since a person is married to exactly one other person.
   *
   * @api public
   */
  function One2OneMultiplicity () {
    this.name = 'ONE2ONE';
  }

  return One2OneMultiplicity;

})();

module.exports = new One2OneMultiplicity();