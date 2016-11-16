'use strict';

var settings = require('./settings').get();
var gremlin = require('gremlin');
var Bluebird = require('bluebird');
var Script = require('./script');
var utils = require('./utils');

/**
 * Connection constructor
 *
 * @api private
 */
var Connection = (function() {
  /**
   * Connection class
   *
   * @api private
   */
  function Connection () {
    this.client = null;
  }

  /**
   * Connect to the gremlin server
   *
   * @param {Number} count Number of connection attempts so far
   * @api private
   */
  Connection.prototype.connect = function (count) {
    var self = this;

    // Check connection
    if (this.connected()) {
      return Bluebird.resolve();
    }

    // Check counter
    if (count > settings.connection.reconnect) {
      return Bluebird.reject('Unable to connect to the Gremlin server ' + settings.connection.host + ':' + settings.connection.port + ' after ' + (settings.connection.reconnect + 1) + ' attempt' + (settings.connection.reconnect > 0 ? 's' : ''));
    }

    // Connect
    this.client = gremlin.createClient(settings.connection.port, settings.connection.host, settings.connection.options);
    this.client.on('error', function (err) {
      if (settings.log > 1) {
        console.log('Error with the Gremlin server: ' + err.stack);
      }
    });

    if (!count) {
      return this.connect.call(this, 1);
    }
    // Wait connection interval
    if (settings.log > 1) {
      console.log('Not connected to the Gremlin server, waiting ' + settings.connection.reconnectInterval + 'ms to reconnect...');
    }
    return utils.delay(settings.connection.reconnectInterval)
    .then(function () {
      return self.connect.call(self, ++count);
    });
  };

  /**
   * Connected
   *
   * @api private
   */
  Connection.prototype.connected = function () {
    return this.client && this.client.connection.ws._socket;
  };

  /**
   * Execute
   *
   * @param {Script|String} script Script to execute
   * @param {Object} bindings Bindings available in the script
   * @param {Number} count Number of connection attempts so far
   * @api public
   */
  Connection.prototype.execute = function (script, bindings, count) {
    var self = this;

    if (utils.isString(script)) {
      script = Script(script, bindings);
    } else if (!(script instanceof Script)) {
      return Bluebird.reject('Invalid script');
    }

    return this.connect()
    .then(function () {
      return new Bluebird(function (resolve, reject) {
        if (settings.log > 2) {
          console.log('Executing script with bindings: ');
          if (settings.log > 3) {
            console.log(JSON.stringify(script.bindings, null, 2));
          } else {
            console.log(script.bindings);
          }
        }
        self.client.execute(script.script, { bindings: script.bindings }, function (err, results) {
          var errorType;
          if (err) {
            count = count || 1;
            // Get error type
            if (err.message === 'WebSocket closed') {
              errorType = 'WebSocketError';
            } else if (err.message.slice(-11) === '(Error 597)') {
              errorType = 'UniquenessError';
            } else {
              errorType = 'Error';
            }
            // Fail after retry
            if (count > settings.connection['retryOn' + errorType]) {
              if (settings.log > 0) {
                console.error('Error: ' + err.message + ', unable to complete the transaction after ' + (settings.connection['retryOn' + errorType] + 1) + ' attempt' + (settings.connection['retryOn' + errorType] > 0 ? 's' : ''));
                if (script.bindings) {
                  console.error('Related bindings: ');
                  if (settings.log > 3) {
                    console.error(JSON.stringify(script.bindings, null, 2));
                  } else {
                    console.error(script.bindings);
                  }
                }
              }
              return reject('Error: ' + err.message + ', unable to complete the transaction after ' + (settings.connection['retryOn' + errorType] + 1) + ' attempt' + (settings.connection['retryOn' + errorType] > 0 ? 's' : ''));
            }
            // Retry
            if (settings.log > 0) {
              console.error('Error: ' + err.message + ', retrying in ' + settings.connection['retryOn' + errorType + 'Interval'] + 'ms...');
            }
            return utils.delay(settings.connection['retryOn' + errorType + 'Interval'])
            .then(function () {
              return self.execute.call(self, script, bindings, ++count);
            })
            .then(resolve)
            .catch(reject);
          }
          if (settings.log > 2) {
            console.log('Success: ');
            if (settings.log > 3) {
              console.log(JSON.stringify(results, null, 2));
            } else {
              console.log(results, null, 2);
            }
          }
          resolve(results);
        });
      });
    });
  };

  /**
   * Message stream
   *
   * @param {Script|String} script Script to execute
   * @param {Object} bindings Bindings available in the script
   * @api public
   */
  Connection.prototype.messageStream = function (script, bindings) {
    var self = this;
    
    if (utils.isString(script)) {
      script = Script(script, bindings);
    } else if (!(script instanceof Script)) {
      return Bluebird.reject('Invalid script');
    }

    return this.connect()
    .then(function () {
      if (settings.log > 2) {
        console.log('Executing script with bindings: ');
        if (settings.log > 3) {
          console.log(JSON.stringify(script.bindings, null, 2));
        } else {
          console.log(script.bindings);
        }
      }
      return self.client.messageStream(script.script, { bindings: script.bindings });
    }).value();
  };

  return Connection;

})();

module.exports = new Connection();