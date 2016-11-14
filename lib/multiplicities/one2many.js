'use strict';

/**
 * One2ManyMultiplicity constructor
 *
 * @api public
 */
var One2ManyMultiplicity = (function() {
  /**
   * One2ManyMultiplicity class
   *
   * Allows at most one incoming edge of such label on any vertex in the graph but places no constraint on outgoing edges. The edge label winnerOf is an example with ONE2MANY multiplicity since each contest is won by at most one person but a person can win multiple contests.
   *
   * @api public
   */
  function One2ManyMultiplicity () {
    this.name = 'ONE2MANY';
  }

  return One2ManyMultiplicity;

})();

module.exports = new One2ManyMultiplicity();