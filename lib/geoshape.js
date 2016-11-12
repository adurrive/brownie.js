'use strict';

var utils = require('./utils');

/**
 * Geoshape constructor
 *
 * @api public
 */
var Geoshape = (function () {

  /**
   * Geoshape class
   *
   * @param {String} type
   * @param {Array} coordinates
   * @param {Number} radius
   * @api public
   */
  function Geoshape (type, coordinates, radius) {
    if (!(this instanceof Geoshape)) {
      return new Geoshape(type, coordinates, radius);
    }

    if (['Point', 'Circle', 'Polygon'].indexOf(type) === -1) {
      throw new Error('Type ' + type + ' not supported for Geoshape, use Point, Circle or Polygon');
    }

    if (!utils.isArray(coordinates)) {
      throw new Error('Invalid coordinates');
    }

    if (radius !== undefined && (isNaN(radius) || type !== 'Circle')) {
      throw new Error('Invalid radius or type');
    }

    this.type = type;
    this.coordinates = coordinates;
    if (radius !== undefined) {
      this.radius = radius;
    }
  }

  /**
   * Point method
   *
   * @param {Number} latitude
   * @param {Number} longitude
   * @api public
   */
  Geoshape.point = function (latitude, longitude) {
    return new Geoshape('Point', [longitude, latitude]);
  };

  /**
   * Circle method
   *
   * @param {Number} latitude
   * @param {Number} longitude
   * @param {Number} radius (in km)
   * @api public
   */
  Geoshape.circle = function (latitude, longitude, radius) {
    return new Geoshape('Circle', [longitude, latitude], radius);
  };

  /**
   * Box method
   *
   * @param {Number} swLatitude South-West latitude
   * @param {Number} swLongitude South-West longitude
   * @param {Number} neLatitude North-East latitude
   * @param {Number} neLongitude North-East longitude
   * @api public
   */
  Geoshape.box = function (swLatitude, swLongitude, neLatitude, neLongitude) {
    return new Geoshape('Polygon', [ 
      [swLongitude, swLatitude],
      [neLongitude, swLatitude],
      [neLongitude, neLatitude],
      [swLongitude, neLatitude]
    ]);
  };

  return Geoshape;

})();

module.exports = Geoshape;