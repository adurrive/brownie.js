/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var utils = require('../lib/utils');
var Types = brownie.Types;
var Cardinalities = brownie.Cardinalities;
var Script = brownie.Script;
var MixedIndex = brownie.MixedIndex;
var Mappings = brownie.Mappings;
var CompositeIndex = brownie.CompositeIndex;
var VertexSchema = brownie.VertexSchema;

describe('vertices', function() {
  this.timeout(20000);
  var vertexSchema, vertexModel, vertexDocument, vertexDocumentBis, vertexDocuments;
  describe('vertexSchema', function() {
    it('should be defined by two arguments', function() {
      vertexSchema = VertexSchema({
        yellow: {
          type: String,
          key: 0
        },
        orange: {
          type: String,
          key: 1
        },
        blue: {
          type: Types.Short,
          threshold: true
        },
        red: {
          type: Date,
          post: Script('$this.property(\'red\', $now + $value)')
        },
        green: [{
          violet: {
            type: String,
            key: 0
          },
          cyan: {
            type: Date, 
            script: Script('$now')
          },
          purple: {
            type: String, 
            value: 'Purple'
          }
        }, {
          duplicate: false,
          verify: Script('true')
        }]
      }, { 
        indices: [
          MixedIndex('byVertexLabelYellow', 'search', {
            '@label': Mappings.STRING,
            '@updatedAt': Mappings.DEFAULT,
            yellow: Mappings.TEXT
          }, true),
          CompositeIndex('byVertexLabelBlue', {
            '@label': true,
            blue: true
          }, false, true)
        ],
        methods: {
          yelloworange: function () {
            return this.properties.yellow.value + this.properties.orange.value;
          }
        }
      });
    });
    it('should be an object', function() {
      assert.equal(typeof vertexSchema, 'object');
    });
    it('should have a valid type property', function() {
      assert.equal(vertexSchema.type, 'vertex');
    });
    it('should be a valid object', function() {
      assert.deepEqual(vertexSchema, {
        'keys': [
          'yellow',
          'orange'
        ],
        'thresholds': [
          'blue'
        ],
        'duplicate': false,
        'properties': {
          'yellow': {
            'type': Types.String,
            'key': 0,
            'cardinality': Cardinalities.SINGLE
          },
          'orange': {
            'type': Types.String,
            'key': 1,
            'cardinality': Cardinalities.SINGLE
          },
          'blue': {
            'type': Types.Short,
            'threshold': true,
            'init': 0,
            'cardinality': Cardinalities.SINGLE
          },
          'red': {
            'type': Types.Date,
            'post': {
              'script': '$this.property(\'red\', $now + $value)',
              'bindings': {}
            },
            'cardinality': Cardinalities.SINGLE
          },
          'green': {
            'keys': [
              'violet'
            ],
            'thresholds': [],
            'duplicate': false,
            'verify': {
              'script': 'true',
              'bindings': {}
            },
            'type': Types.String,
            'cardinality': Cardinalities.SET,
            'properties': {
              'violet': {
                'type': Types.String,
                'key': 0,
                'cardinality': Cardinalities.SINGLE
              },
              'cyan': {
                'type': Types.Date,
                'script': {
                  'script': '$now',
                  'bindings': {}
                },
                'locked': true,
                'cardinality': Cardinalities.SINGLE
              },
              'purple': {
                'type': Types.String,
                'value': 'Purple',
                'locked': true,
                'cardinality': Cardinalities.SINGLE
              }
            }
          }
        },
        'indices': [
          {
            'index': 'mixed',
            'name': 'byVertexLabelYellow',
            'backendName': 'search',
            'keys': {
              '@label': Mappings.STRING,
              '@updatedAt': Mappings.DEFAULT,
              'yellow': Mappings.TEXT
            },
            'global': true
          },
          {
            'index': 'composite',
            'name': 'byVertexLabelBlue',
            'keys': {
              '@label': true,
              'blue': true
            },
            'unique': false,
            'global': true
          }
        ],
        'methods': {
          'yelloworange': vertexSchema.methods.yelloworange
        }
      });
    });
    it('should have an addVerify method', function() {
      assert.equal(typeof vertexSchema.addVerify, 'function');
    });
    it('should have an addIndex method', function() {
      assert.equal(typeof vertexSchema.addIndex, 'function');
    });
    it('should have an addMethod method', function() {
      assert.equal(typeof vertexSchema.addMethod, 'function');
    });
  });
  describe('vertexModel', function() {
    it('should be defined by two arguments', function() {
      vertexModel = brownie.model('vertexLabel', vertexSchema);
    });
    it('should be a function', function() {
      assert.equal(typeof vertexModel, 'function');
    });
    it('should have a valid schema property', function() {
      assert.equal(vertexModel.schema, vertexSchema);
    });
    it('should have a valid label property', function() {
      assert.equal(vertexModel.label, 'vertexLabel');
    });
    it('should have a valid type property', function() {
      assert.equal(vertexModel.type, 'vertex');
    });
    it('should initialize', function() {
      return brownie.initialize();
    });
  });
  describe('vertexDocument', function() {
    it('should reset all vertex documents', function() {
      return vertexModel({
        script: Script('g.V().has(\'@label\', \'vertexLabel\')'),
        remove: true
      }).save();
    });
    it('should be defined by one argument', function() {
      vertexDocument = vertexModel({
        properties: {
          yellow: 'Yellow light',
          orange: 'Orange light',
          red: 10000,
          blue: 5,
          green: [
            {
              properties: {
                violet: 'violet light'
              }
            },
            {
              properties: {
                violet: 'violet dark'
              }
            }
          ]
        }
      });
    });
    it('should accept scripts when added explicitly', function() {
      vertexDocument.addProperty('red', Script('50000 + 10000'), true);
    });
    it('should be an object', function() {
      assert.equal(typeof vertexDocument, 'object');
    });
    it('should have a valid schema property', function() {
      assert.equal(vertexDocument.schema, vertexSchema);
    });
    it('should be a valid object', function() {
      assert.equal(vertexDocument.hasOwnProperty('uuid'), true);
      assert.deepEqual(vertexDocument, {
        'uuid': vertexDocument.uuid,
        'label': 'vertexLabel',
        'type': 'vertex',
        'synced': false,
        'properties': {
          'yellow': {
            'value': 'Yellow light'
          },
          'orange': {
            'value': 'Orange light'
          },
          'blue': {
            'value': 5
          },
          'red': {
            'script': {
              'script': '50000 + 10000',
              'bindings': {}
            }
          },
          'green': [
            {
              'properties': {
                'violet': {
                  'value': 'violet light'
                }
              }
            },
            {
              'properties': {
                'violet': {
                  'value': 'violet dark'
                }
              }
            }
          ]
        }
      });
    });
    it('should have a valid customized yelloworange method', function() {
      assert.equal(vertexDocument.yelloworange(), 'Yellow lightOrange light');
    });
    it('should have a valid addId method', function() {
      assert.equal(typeof vertexDocument.addId, 'function');
      vertexDocument.addId(123);
      assert.equal(vertexDocument.id, 123);
      delete vertexDocument.id;
    });
    it('should have a valid addKey method', function() {
      assert.equal(typeof vertexDocument.addKey, 'function');
      vertexDocument.addKey('testKey');
      assert.equal(vertexDocument.key, 'testKey');
      delete vertexDocument.key;
    });
    it('should have a valid addScript method', function() {
      assert.equal(typeof vertexDocument.addScript, 'function');
      vertexDocument.addScript(Script('1'));
      assert.deepEqual(vertexDocument.script, Script('1'));
      delete vertexDocument.script;
    });
    it('should have a valid addVerify method', function() {
      assert.equal(typeof vertexDocument.addVerify, 'function');
      vertexDocument.addVerify('true');
      assert.deepEqual(vertexDocument.verify, Script('true'));
      delete vertexDocument.verify;
    });
    it('should have a valid value method', function() {
      assert.equal(typeof vertexDocument.value, 'function');
      assert.equal(vertexDocument.value('yellow'), 'Yellow light');
      assert.deepEqual(vertexDocument.value('green', { violet: 'violet light' }), [ { violet: 'violet light' } ]);
      assert.deepEqual(vertexDocument.value('green', { violet: 'violet dark' }), [ { violet: 'violet dark' } ]);
    });
    it('should have a valid values method', function() {
      assert.equal(typeof vertexDocument.values, 'function');
      assert.deepEqual(vertexDocument.values(), {
        'yellow': 'Yellow light',
        'orange': 'Orange light',
        'blue':  5,
        'green': [
          {
            'violet': 'violet light'
          },
          {
            'violet': 'violet dark'
          }
        ]
      });
    });
    it('should have a valid generateKey method', function() {
      assert.equal(typeof vertexDocument.generateKey, 'function');
      assert.deepEqual(vertexDocument.generateKey(), 'Yellow light|Orange light');
    });
    it('should have a valid bindings method', function() {
      var bindings;
      bindings = vertexDocument.bindings();
      assert.equal(bindings.hasOwnProperty('uuid'), true);
      assert.deepEqual(bindings, {
        'uuid': bindings.uuid,
        'label': 'vertexLabel',
        'type': 'vertex',
        'keys': [
          'yellow',
          'orange'
        ],
        'thresholds': [
          'blue'
        ],
        'key': 'Yellow light|Orange light',
        'duplicate': false,
        'properties': {
          'yellow': {
            'value': 'Yellow light'
          },
          'orange': {
            'value': 'Orange light'
          },
          'blue': {
            'value': 5
          },
          'red': {
            'script': {
              'script': '50000 + 10000',
              'bindings': {}
            },
            'post': {
              'script': '$this.property(\'red\', $now + $value)',
              'bindings': {}
            }
          },
          'green': [
            {
              'keys': [
                'violet'
              ],
              'thresholds': [],
              'duplicate': false,
              'verify': {
                'script': 'true',
                'bindings': {}
              },
              'key': 'violet light',
              'properties': {
                'violet': {
                  'value': 'violet light'
                },
                'cyan': {
                  'script': {
                    'script': '$now',
                    'bindings': {}
                  }
                },
                'purple': {
                  'value': 'Purple'
                }
              }
            },
            {
              'keys': [
                'violet'
              ],
              'thresholds': [],
              'duplicate': false,
              'verify': {
                'script': 'true',
                'bindings': {}
              },
              'key': 'violet dark',
              'properties': {
                'violet': {
                  'value': 'violet dark'
                },
                'cyan': {
                  'script': {
                    'script': '$now',
                    'bindings': {}
                  }
                },
                'purple': {
                  'value': 'Purple'
                }
              }
            }
          ]
        }
      });
      bindings = vertexDocument.bindings(true);
      assert.equal(bindings.hasOwnProperty('uuid'), true);
      assert.deepEqual(bindings, {
        'uuid': bindings.uuid,
        'label': 'vertexLabel',
        'type': 'vertex',
        'keys': [
          'yellow',
          'orange'
        ],
        'key': 'Yellow light|Orange light',
        'properties': {
          'yellow': {
            'value': 'Yellow light'
          },
          'orange': {
            'value': 'Orange light'
          }
        }
      });
    });
    it('should have a valid addProperty method', function() {
      assert.equal(typeof vertexDocument.addProperty, 'function');
      vertexDocument.addProperty('yellow', 'Yellow dark');
      assert.equal(vertexDocument.value('yellow'), 'Yellow dark');
    });
    it('should have a valid addProperties method', function() {
      assert.equal(typeof vertexDocument.addProperties, 'function');
      vertexDocument.addProperties({ yellow: 'Yellow light', blue: 7 });
      assert.equal(vertexDocument.value('yellow'), 'Yellow light');
      assert.equal(vertexDocument.value('blue'), 7);
    });
    it('should have a save method', function() {
      assert.equal(typeof vertexDocument.save, 'function');
    });
    it('should save the document and return the object', function() {
      return vertexDocument.save(true)
      .then(function (graph) {
        var doc;
        doc = graph.first();
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'vertexLabel',
          'type': 'vertex',
          'synced': true,
          'id': doc.id,
          'key': 'Yellow light|Orange light',
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'properties': {
            'orange': {
              'value': 'Orange light'
            },
            'green': [
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet dark'
                  },
                  'cyan': {
                    'value': doc.properties.green[0].properties.cyan.value
                  }
                },
                'id': doc.properties.green[0].id,
                'key': 'violet dark',
                'updatedAt': doc.properties.green[0].updatedAt,
                'createdAt': doc.properties.green[0].createdAt
              },
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet light'
                  },
                  'cyan': {
                    'value': doc.properties.green[1].properties.cyan.value
                  }
                },
                'id': doc.properties.green[1].id,
                'key': 'violet light',
                'updatedAt': doc.properties.green[1].updatedAt,
                'createdAt': doc.properties.green[1].createdAt
              }
            ],
            'blue': {
              'value': 7
            },
            'red': {
              'value': doc.properties.red.value
            },
            'yellow': {
              'value': 'Yellow light'
            }
          }
        });
      });
    });
    it('should not save the document with a lower threshold value', function() {
      vertexDocument.addProperty('blue', 3);
      vertexDocument.properties.green[0].addKey('violet light');
      vertexDocument.properties.green[0].addProperty('violet', 'violet shiny');
      assert.deepEqual(vertexDocument.bindings().properties.green[0], {
        'keys': [
          'violet'
        ],
        'duplicate': false,
        'properties': {
          'violet': {
            'value': 'violet shiny'
          },
          'cyan': {
            'script': {
              'script': '$now',
              'bindings': {}
            }
          },
          'purple': {
            'value': 'Purple'
          }
        },
        'key': 'violet light',
        'thresholds': [],
        'verify': {
          'script': 'true',
          'bindings': {}
        }
      });
      return vertexDocument.save(true)
      .then(function (graph) {
        assert.equal(graph.isEmpty(), true);
      });
    });
    it('should save the document without a threshold value and change item key', function() {
      delete vertexDocument.properties.blue;
      return vertexDocument.save(true)
      .then(function (graph) {
        var doc;
        doc = graph.first();
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'vertexLabel',
          'type': 'vertex',
          'synced': true,
          'id': doc.id,
          'key': 'Yellow light|Orange light',
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'properties': {
            'orange': {
              'value': 'Orange light'
            },
            'green': [
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet dark'
                  },
                  'cyan': {
                    'value': doc.properties.green[0].properties.cyan.value
                  }
                },
                'id': doc.properties.green[0].id,
                'key': 'violet dark',
                'updatedAt': doc.properties.green[0].updatedAt,
                'createdAt': doc.properties.green[0].createdAt
              },
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet shiny'
                  },
                  'cyan': {
                    'value': doc.properties.green[1].properties.cyan.value
                  }
                },
                'id': doc.properties.green[1].id,
                'key': 'violet shiny',
                'updatedAt': doc.properties.green[1].updatedAt,
                'createdAt': doc.properties.green[1].createdAt
              }
            ],
            'blue': {
              'value': 7
            },
            'red': {
              'value': doc.properties.red.value
            },
            'yellow': {
              'value': 'Yellow light'
            }
          }
        });
      });
    });
    it('should have a get method', function() {
      assert.equal(typeof vertexDocument.get, 'function');
    });
    it('should get the document', function() {
      vertexDocument.addVerify('!$this || $this.value(\'orange\').contains(\'light\')');
      return vertexDocument.get()
      .then(function (graph) {
        var doc;
        doc = graph.first();
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'vertexLabel',
          'type': 'vertex',
          'synced': true,
          'id': doc.id,
          'key': 'Yellow light|Orange light',
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'properties': {
            'orange': {
              'value': 'Orange light'
            },
            'green': [
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet dark'
                  },
                  'cyan': {
                    'value': doc.properties.green[0].properties.cyan.value
                  }
                },
                'id': doc.properties.green[0].id,
                'key': 'violet dark',
                'updatedAt': doc.properties.green[0].updatedAt,
                'createdAt': doc.properties.green[0].createdAt
              },
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet shiny'
                  },
                  'cyan': {
                    'value': doc.properties.green[1].properties.cyan.value
                  }
                },
                'id': doc.properties.green[1].id,
                'key': 'violet shiny',
                'updatedAt': doc.properties.green[1].updatedAt,
                'createdAt': doc.properties.green[1].createdAt
              }
            ],
            'blue': {
              'value': 7
            },
            'red': {
              'value': doc.properties.red.value
            },
            'yellow': {
              'value': 'Yellow light'
            }
          }
        });
        delete vertexDocument.verify;
      });
    });
    it('should not get the document', function() {
      vertexDocument.addVerify('$this && $this.value(\'orange\').contains(\'dark\')');
      return vertexDocument.get()
      .then(function (graph) {
        assert.equal(graph.isEmpty(), true);
        delete vertexDocument.verify;
      });
    });
    it('should merge properties of documents and save the final document', function() {
      vertexDocument = vertexModel({
        properties: {
          yellow: 'Yellow light',
          orange: 'Orange light',
          red: 10000,
          blue: 5,
          green: [
            {
              properties: {
                violet: 'violet shiny'
              }
            }
          ]
        }
      });
      vertexDocumentBis = vertexModel({
        properties: {
          yellow: 'Yellow red',
          blue: 9,
          green: [
            {
              properties: {
                violet: 'violet dark'
              }
            }
          ]
        }
      });
      vertexDocument.addProperties(vertexDocumentBis);
      return vertexDocument.save(true)
      .then(function (graph) {
        var doc;
        doc = graph.first();
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'vertexLabel',
          'type': 'vertex',
          'synced': true,
          'id': doc.id,
          'key': 'Yellow red|Orange light',
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'properties': {
            'orange': {
              'value': 'Orange light'
            },
            'green': [
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet dark'
                  },
                  'cyan': {
                    'value': doc.properties.green[0].properties.cyan.value
                  }
                },
                'id': doc.properties.green[0].id,
                'key': 'violet dark',
                'updatedAt': doc.properties.green[0].updatedAt,
                'createdAt': doc.properties.green[0].createdAt
              },
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet shiny'
                  },
                  'cyan': {
                    'value': doc.properties.green[1].properties.cyan.value
                  }
                },
                'id': doc.properties.green[1].id,
                'key': 'violet shiny',
                'updatedAt': doc.properties.green[1].updatedAt,
                'createdAt': doc.properties.green[1].createdAt
              }
            ],
            'blue': {
              'value': 9
            },
            'red': {
              'value': doc.properties.red.value
            },
            'yellow': {
              'value': 'Yellow red'
            }
          }
        });
      });
    });
    it('should get both documents', function() {
      vertexDocuments = vertexModel({
        script: Script('g.V().has(\'@label\', \'vertexLabel\').has(\'orange\', \'Orange light\')')
      });
      return vertexDocuments.get()
      .then(function (graph) {
        assert.equal(Object.keys(graph.graph).length, 2);
      });
    });
    it('should query the document', function() {
      var params = {
        index: 'byVertexLabelYellow',
        field: 'yellow',
        query: 'yell* red',
        filter: 'AND $vertex$"@label":vertexLabel',
        offset: 0,
        limit: 10
      };
      return utils.delay(2000)
      .then(function () {
        return brownie.query(params);
      })
      .then(function (graph) {
        var doc;
        doc = graph.first();
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'vertexLabel',
          'type': 'vertex',
          'synced': true,
          'id': doc.id,
          'score': doc.score,
          'key': 'Yellow red|Orange light',
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'properties': {
            'orange': {
              'value': 'Orange light'
            },
            'green': [
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet dark'
                  },
                  'cyan': {
                    'value': doc.properties.green[0].properties.cyan.value
                  }
                },
                'id': doc.properties.green[0].id,
                'key': 'violet dark',
                'updatedAt': doc.properties.green[0].updatedAt,
                'createdAt': doc.properties.green[0].createdAt
              },
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet shiny'
                  },
                  'cyan': {
                    'value': doc.properties.green[1].properties.cyan.value
                  }
                },
                'id': doc.properties.green[1].id,
                'key': 'violet shiny',
                'updatedAt': doc.properties.green[1].updatedAt,
                'createdAt': doc.properties.green[1].createdAt
              }
            ],
            'blue': {
              'value': 9
            },
            'red': {
              'value': doc.properties.red.value
            },
            'yellow': {
              'value': 'Yellow red'
            }
          }
        });
      });
    });
    it('should have a delete method', function() {
      assert.equal(typeof vertexDocument.delete, 'function');
    });
    it('should have a property delete method', function() {
      assert.equal(typeof vertexDocument.properties.red.delete, 'function');
    });
    it('should have an item delete method', function() {
      assert.equal(typeof vertexDocument.properties.green[0].delete, 'function');
    });
    it('should delete properties and items', function() {
      vertexDocument.properties.red.delete();
      assert.deepEqual(vertexDocument.bindings().properties.red, { remove: true });
      vertexDocument.properties.green[0].delete();
      assert.deepEqual(vertexDocument.bindings(), {
        'uuid': vertexDocument.uuid,
        'label': 'vertexLabel',
        'type': 'vertex',
        'keys': [
          'yellow',
          'orange'
        ],
        'duplicate': false,
        'properties': {
          'yellow': {
            'value': 'Yellow red'
          },
          'orange': {
            'value': 'Orange light'
          },
          'blue': {
            'value': 9
          },
          'red': {
            'remove': true
          },
          'green': [
            {
              'keys': [
                'violet'
              ],
              'duplicate': false,
              'properties': {
                'violet': {
                  'value': 'violet shiny'
                }
              },
              'remove': true,
              'thresholds': [],
              'verify': {
                'script': 'true',
                'bindings': {}
              },
              'key': 'violet shiny'
            },
            {
              'keys': [
                'violet'
              ],
              'duplicate': false,
              'properties': {
                'violet': {
                  'value': 'violet dark'
                },
                'cyan': {
                  'script': {
                    'script': '$now',
                    'bindings': {}
                  }
                },
                'purple': {
                  'value': 'Purple'
                }
              },
              'thresholds': [],
              'verify': {
                'script': 'true',
                'bindings': {}
              },
              'key': 'violet dark'
            }
          ]
        },
        'thresholds': [
          'blue'
        ],
        'key': 'Yellow red|Orange light'
      });
      return vertexDocument.save(true)
      .then(function (graph) {
        var doc;
        doc = graph.first();
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'vertexLabel',
          'type': 'vertex',
          'synced': true,
          'id': doc.id,
          'key': 'Yellow red|Orange light',
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'properties': {
            'orange': {
              'value': 'Orange light'
            },
            'green': [
              {
                'properties': {
                  'purple': {
                    'value': 'Purple'
                  },
                  'violet': {
                    'value': 'violet dark'
                  },
                  'cyan': {
                    'value': doc.properties.green[0].properties.cyan.value
                  }
                },
                'id': doc.properties.green[0].id,
                'key': 'violet dark',
                'updatedAt': doc.properties.green[0].updatedAt,
                'createdAt': doc.properties.green[0].createdAt
              }
            ],
            'blue': {
              'value': 9
            },
            'yellow': {
              'value': 'Yellow red'
            }
          }
        });
      });
    });
    it('should delete all items', function() {
      vertexDocument.addProperty('green', []);
      assert.deepEqual(vertexDocument.bindings().properties.green, []);
      return vertexDocument.save(true)
      .then(function (graph) {
        var doc;
        doc = graph.first();
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'vertexLabel',
          'type': 'vertex',
          'synced': true,
          'id': doc.id,
          'key': 'Yellow red|Orange light',
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'properties': {
            'orange': {
              'value': 'Orange light'
            },
            'blue': {
              'value': 9
            },
            'yellow': {
              'value': 'Yellow red'
            }
          }
        });
      });
    });
    it('should delete the document', function() {
      vertexDocument.delete();
      assert.equal(vertexDocument.remove, true);
      assert.equal(vertexDocument.bindings().remove, true);
      return vertexDocument.save(true)
      .then(function (graph) {
        assert.equal(graph.isEmpty(), true);
        delete vertexDocument.remove;
      });
    });
    it('should not get the document', function() {
      return vertexDocument.get()
      .then(function (graph) {
        assert.equal(graph.isEmpty(), true);
      });
    });
  });
});