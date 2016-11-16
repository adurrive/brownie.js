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
   * @param {String} type Type of geoshape: Point, Circle or Polygon
   * @param {Array} coordinates Coordinates of the geoshape
   * @param {Number} radius Radius of the circle in km
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
   * @param {Number} latitude Latitude of the point
   * @param {Number} longitude Longitude of the point
   * @api public
   */
  Geoshape.point = function (latitude, longitude) {
    return new Geoshape('Point', [longitude, latitude]);
  };

  /**
   * Circle method
   *
   * @param {Number} latitude Latitude of the circle
   * @param {Number} longitude Longitude of the circle
   * @param {Number} radius Radius of the circle in km
   * @api public
   */
  Geoshape.circle = function (latitude, longitude, radius) {
    return new Geoshape('Circle', [longitude, latitude], radius);
  };

  /**
   * Box method
   *
   * @param {Number} swLatitude South-West latitude of the box
   * @param {Number} swLongitude South-West longitude of the box
   * @param {Number} neLatitude North-East latitude of the box
   * @param {Number} neLongitude North-East longitude of the box
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