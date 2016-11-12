/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Types = brownie.Types;
var Cardinalities = brownie.Cardinalities;
var Script = brownie.Script;
var Increment = brownie.Increment;
var Geoshape = brownie.Geoshape;
var MixedIndex = brownie.MixedIndex;
var Mappings = brownie.Mappings;
var Multiplicities = brownie.Multiplicities;
var CompositeIndex = brownie.CompositeIndex;
var VertexSchema = brownie.VertexSchema;
var EdgeSchema = brownie.EdgeSchema;

describe('edges', function() {
  this.timeout(20000);
  var edgeSchema, edgeModel, edgeDocument, vertexModelLight, vertexDocumentLight;
  describe('edgeSchema', function() {
    it('initialize', function() {
      vertexModelLight = brownie.model('vertexLabelLight', VertexSchema({
        yellow: {
          type: String,
          key: 0
        },
        orange: {
          type: String,
          key: 1
        }
      }));
    });
    it('should be defined by four arguments', function() {
      edgeSchema = EdgeSchema([
        vertexModelLight
      ], [
        vertexModelLight
      ], {
        kiwi: {
          type: Array,
          required: true
        },
        yellow: {
          type: String
        },
        orange: {
          type: String
        },
        blue: {
          type: Types.Short,
          init: 0
        },
        red: {
          type: Date,
          init: 0
        },
        brown: {
          type: Types.Geoshape
        }
      }, { 
        indices: [
          MixedIndex('byEdgeLabelYellow', 'search', {
            '@label': Mappings.STRING,
            '@updatedAt': Mappings.DEFAULT,
            yellow: Mappings.TEXT
          }, true),
          CompositeIndex('byEdgeLabelBlue', {
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
      assert.equal(typeof edgeSchema, 'object');
    });
    it('should have a valid type property', function() {
      assert.equal(edgeSchema.type, 'edge');
    });
    it('should be a valid object', function() {
      assert.deepEqual(edgeSchema, {
        'outVModels': { 
          'vertexLabelLight': vertexModelLight
        },
        'inVModels': {
          'vertexLabelLight': vertexModelLight
        },
        'duplicate': false,
        'multiplicity': Multiplicities.MULTI,
        'keys': [],
        'thresholds': [],
        'properties': {
          'kiwi': {
            'type': Types.Array,
            'cardinality': Cardinalities.SINGLE,
            'required': true
          },
          'yellow': {
            'type': Types.String,
            'cardinality': Cardinalities.SINGLE
          },
          'orange': {
            'type': Types.String,
            'cardinality': Cardinalities.SINGLE
          },
          'blue': {
            'type': Types.Short,
            'init': 0,
            'cardinality': Cardinalities.SINGLE
          },
          'red': {
            'type': Types.Date,
            'init': 0,
            'cardinality': Cardinalities.SINGLE
          },
          'brown': {
            'type': Types.Geoshape,
            'cardinality': Cardinalities.SINGLE
          }
        },
        'indices': [
          {
            'index': 'mixed',
            'name': 'byEdgeLabelYellow',
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
            'name': 'byEdgeLabelBlue',
            'keys': {
              '@label': true,
              'blue': true
            },
            'unique': false,
            'global': true
          }
        ],
        'methods': {
          'yelloworange': edgeSchema.methods.yelloworange
        }
      });
    });
    it('should have an addVerify method', function() {
      assert.equal(typeof edgeSchema.addVerify, 'function');
    });
    it('should have an addIndex method', function() {
      assert.equal(typeof edgeSchema.addIndex, 'function');
    });
    it('should have an addMethod method', function() {
      assert.equal(typeof edgeSchema.addMethod, 'function');
    });
  });
  describe('edgeModel', function() {
    it('should be defined by two arguments', function() {
      edgeModel = brownie.model('edgeLabel', edgeSchema);
    });
    it('should be a function', function() {
      assert.equal(typeof edgeModel, 'function');
    });
    it('should have a valid schema property', function() {
      assert.equal(edgeModel.schema, edgeSchema);
    });
    it('should have a valid label property', function() {
      assert.equal(edgeModel.label, 'edgeLabel');
    });
    it('should have a valid type property', function() {
      assert.equal(edgeModel.type, 'edge');
    });
    it('should initialize', function() {
      return brownie.initialize();
    });
  });
  describe('edgeDocument', function() {
    it('should reset all documents', function() {
      return vertexModelLight({
        script: Script('g.V().has(\'@label\', \'vertexLabelLight\')'),
        remove: true
      }).save()
      .then(function () {
        return edgeModel({
          script: Script('g.E().has(\'@label\', \'edgeLabel\')'),
          remove: true
        }).save();
      });
    });
    it('initialize', function() {
      vertexDocumentLight = vertexModelLight({ 
        properties: {
          yellow: 'Yellow light',
          orange: 'Orange light'
        }
      });
    });
    it('should be defined by one argument', function() {
      edgeDocument = edgeModel({
        outV: vertexDocumentLight,
        inV: vertexDocumentLight,
        properties: {
          kiwi: ['green', 'gold'],
          yellow: 'Yellow light',
          orange: 'Orange light',
          red: Increment(2), // 2 days for Date
          brown: Geoshape.point(46, 2)
        }
      });
    });
    it('should add a script property', function() {
      edgeDocument.addProperty('blue', Script('if ($this) { $this.value(\'blue\') + bindings.increment } else { bindings.increment }', { increment: 2 }), true);
    });
    it('should be an object', function() {
      assert.equal(typeof edgeDocument, 'object');
    });
    it('should have a valid schema property', function() {
      assert.equal(edgeDocument.schema, edgeSchema);
    });
    it('should have a valid object', function() {
      assert.equal(edgeDocument.hasOwnProperty('uuid'), true);
      assert.equal(edgeDocument.inV.hasOwnProperty('uuid'), true);
      assert.equal(edgeDocument.outV.hasOwnProperty('uuid'), true);
      assert.equal(edgeDocument.outV.uuid, edgeDocument.inV.uuid);
      assert.deepEqual(edgeDocument, {
        'uuid': edgeDocument.uuid,
        'label': 'edgeLabel',
        'type': 'edge',
        'synced': false,
        'properties': {
          'kiwi': {
            'value': ['green', 'gold']
          },
          'yellow': {
            'value': 'Yellow light'
          },
          'orange': {
            'value': 'Orange light'
          },
          'blue': {
            'script': {
              'script': 'if ($this) { $this.value(\'blue\') + bindings.increment } else { bindings.increment }',
              'bindings': { 'increment': 2 }
            }
          },
          'red': {
            'increment': {
              'value': 2
            }
          },
          'brown': {
            'value': {
              'type': 'Point',
              'coordinates': [2, 46]
            }
          }
        },
        'outV': {
          'uuid': edgeDocument.outV.uuid,
          'label': 'vertexLabelLight',
          'type': 'vertex',
          'synced': false,
          'properties': {
            'yellow': {
              'value': 'Yellow light'
            },
            'orange': {
              'value': 'Orange light'
            }
          }
        },
        'inV': {
          'uuid': edgeDocument.inV.uuid,
          'label': 'vertexLabelLight',
          'type': 'vertex',
          'synced': false,
          'properties': {
            'yellow': {
              'value': 'Yellow light'
            },
            'orange': {
              'value': 'Orange light'
            }
          }
        }
      });
    });
    it('should have a valid customized yelloworange method', function() {
      assert.equal(edgeDocument.yelloworange(), 'Yellow lightOrange light');
    });
    it('should have a valid addId method', function() {
      assert.equal(typeof edgeDocument.addId, 'function');
      edgeDocument.addId('111-111-111-111');
      assert.equal(edgeDocument.id, '111-111-111-111');
      delete edgeDocument.id;
    });
    it('should have a valid addKey method', function() {
      assert.equal(typeof edgeDocument.addKey, 'function');
      edgeDocument.addKey('testKey');
      assert.equal(edgeDocument.key, 'testKey');
      delete edgeDocument.key;
    });
    it('should have a valid addScript method', function() {
      assert.equal(typeof edgeDocument.addScript, 'function');
      edgeDocument.addScript('1');
      assert.deepEqual(edgeDocument.script, Script('1'));
      delete edgeDocument.script;
    });
    it('should have a valid addVerify method', function() {
      assert.equal(typeof edgeDocument.addVerify, 'function');
      edgeDocument.addVerify('true');
      assert.deepEqual(edgeDocument.verify, Script('true'));
      delete edgeDocument.verify;
    });
    it('should have a valid value method', function() {
      assert.equal(typeof edgeDocument.value, 'function');
      assert.equal(edgeDocument.value('yellow'), 'Yellow light');
    });
    it('should have a valid values method', function() {
      assert.equal(typeof edgeDocument.values, 'function');
      assert.deepEqual(edgeDocument.values(), {
        'kiwi': ['green', 'gold'],
        'yellow': 'Yellow light',
        'orange': 'Orange light',
        'brown': {
          'type': 'Point',
          'coordinates': [2, 46]
        }
      });
    });
    it('should have a valid generateKey method', function() {
      assert.equal(typeof edgeDocument.generateKey, 'function');
      assert.deepEqual(edgeDocument.generateKey(), null);
    });
    it('should have a valid bindings method', function() {
      var bindings;
      bindings = edgeDocument.bindings();
      assert.equal(bindings.hasOwnProperty('uuid'), true);
      assert.equal(bindings.inV.hasOwnProperty('uuid'), true);
      assert.equal(bindings.outV.hasOwnProperty('uuid'), true);
      assert.equal(bindings.outV.uuid, bindings.inV.uuid);
      assert.deepEqual(bindings, {
        'uuid': bindings.uuid,
        'label': 'edgeLabel',
        'type': 'edge',
        'keys': [],
        'thresholds': [],
        'duplicate': false,
        'properties': {
          'kiwi': {
            'value': '["green","gold"]'
          },
          'yellow': {
            'value': 'Yellow light'
          },
          'orange': {
            'value': 'Orange light'
          },
          'blue': {
            'script': {
              'script': 'if ($this) { $this.value(\'blue\') + bindings.increment } else { bindings.increment }',
              'bindings': { 'increment': 2 }
            },
            'init': 0
          },
          'red': {
            'increment': {
              'value': 2
            },
            'init': 0
          },
          'brown': {
            'value': {
              'type': 'Point',
              'coordinates': [2, 46]
            }
          }
        },
        'outV': {
          'uuid': bindings.outV.uuid,
          'label': 'vertexLabelLight',
          'type': 'vertex',
          'keys': [
            'yellow',
            'orange'
          ],
          'thresholds': [],
          'key': 'Yellow light|Orange light',
          'duplicate': false,
          'properties': {
            'yellow': {
              'value': 'Yellow light'
            },
            'orange': {
              'value': 'Orange light'
            }
          }
        },
        'inV': {
          'uuid': bindings.inV.uuid,
          'label': 'vertexLabelLight',
          'type': 'vertex',
          'keys': [
            'yellow',
            'orange'
          ],
          'thresholds': [],
          'key': 'Yellow light|Orange light',
          'duplicate': false,
          'properties': {
            'yellow': {
              'value': 'Yellow light'
            },
            'orange': {
              'value': 'Orange light'
            }
          }
        }
      });
      bindings = edgeDocument.bindings(true);
      assert.equal(bindings.hasOwnProperty('uuid'), true);
      assert.equal(bindings.inV.hasOwnProperty('uuid'), true);
      assert.equal(bindings.outV.hasOwnProperty('uuid'), true);
      assert.equal(bindings.outV.uuid, bindings.inV.uuid);
      assert.deepEqual(bindings, {
        'uuid': bindings.uuid,
        'label': 'edgeLabel',
        'type': 'edge',
        'keys': [],
        'properties': {},
        'outV': {
          'uuid': bindings.outV.uuid,
          'label': 'vertexLabelLight',
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
        },
        'inV': {
          'uuid': bindings.inV.uuid,
          'label': 'vertexLabelLight',
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
        }
      });
    });
    it('should have a valid addProperty method', function() {
      assert.equal(typeof edgeDocument.addProperty, 'function');
      edgeDocument.addProperty('yellow', 'Yellow dark');
      assert.equal(edgeDocument.value('yellow'), 'Yellow dark');
    });
    it('should have a valid addProperties method', function() {
      assert.equal(typeof edgeDocument.addProperties, 'function');
      edgeDocument.addProperties({ yellow: 'Yellow light' });
      assert.equal(edgeDocument.value('yellow'), 'Yellow light');
    });
    it('should have a valid save method', function() {
      assert.equal(typeof edgeDocument.save, 'function');
    });
    it('should save the document and return the object', function() {
      return edgeDocument.save(true)
      .then(function (graph) {
        var doc;
        doc = graph.first('edge');
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'edgeLabel',
          'type': 'edge',
          'synced': true,
          'id': doc.id,
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'properties': {
            'blue': {
              'value': doc.properties.blue.value
            },
            'kiwi': {
              'value': ['green', 'gold']
            },
            'orange': {
              'value': 'Orange light'
            },
            'yellow': {
              'value': 'Yellow light'
            },
            'red': {
              'value': doc.properties.red.value
            },
            'brown': {
              'value': {
                'type': 'Point',
                'coordinates': [2, 46]
              }
            }
          },
          'outV': {
            'uuid': doc.outV.uuid,
            'type': 'vertex',
            'label': 'vertexLabelLight',
            'synced': false,
            'properties': {},
            'id': doc.outV.id
          },
          'inV': {
            'uuid': doc.inV.uuid,
            'type': 'vertex',
            'label': 'vertexLabelLight',
            'synced': false,
            'properties': {},
            'id': doc.inV.id
          }
        });
      });
    });
    it('should have a valid get method', function() {
      assert.equal(typeof edgeDocument.get, 'function');
    });
    it('should get the document', function() {
      return edgeDocument.get()
      .then(function (graph) {
        var doc;
        doc = graph.first('edge');
        assert.deepEqual(doc, {
          'uuid': doc.uuid,
          'label': 'edgeLabel',
          'type': 'edge',
          'synced': true,
          'id': doc.id,
          'updatedAt': doc.updatedAt,
          'createdAt': doc.createdAt,
          'outV': {
            'uuid': doc.outV.uuid,
            'type': 'vertex',
            'label': 'vertexLabelLight',
            'synced': false,
            'properties': {},
            'id': doc.outV.id
          },
          'inV': {
            'uuid': doc.inV.uuid,
            'type': 'vertex',
            'label': 'vertexLabelLight',
            'synced': false,
            'properties': {},
            'id': doc.inV.id
          },
          'properties': {
            'blue': {
              'value': doc.properties.blue.value
            },
            'kiwi': {
              'value': ['green', 'gold']
            },
            'orange': {
              'value': 'Orange light'
            },
            'yellow': {
              'value': 'Yellow light'
            },
            'red': {
              'value': doc.properties.red.value
            },
            'brown': {
              'value': {
                'type': 'Point',
                'coordinates': [2, 46]
              }
            }
          }
        });
      });
    });
    it('should have a valid delete method', function() {
      assert.equal(typeof edgeDocument.delete, 'function');
      edgeDocument.delete();
      assert.equal(edgeDocument.remove, true);
      delete edgeDocument.remove;
    });
  });
});