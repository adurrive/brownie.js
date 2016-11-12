/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';

var assert = require('assert');
var brownie = require('../index');
var Graph = brownie.Graph;
var VertexSchema = brownie.VertexSchema;

describe('graph', function() {
  var graph, vertexModelLight, vertexDocumentLight, vertexDocumentDark;
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
    vertexDocumentLight = vertexModelLight({
      properties: {
        yellow: 'Yellow light',
        orange: 'Orange light'
      }
    });
    vertexDocumentDark = vertexModelLight({
      properties: {
        yellow: 'Yellow dark',
        orange: 'Orange dark'
      }
    });
  });
  it('should be defined without argument', function() {
    graph = Graph();
    assert.deepEqual(graph.graph, {});
  });
  it('should be defined by one argument', function() {
    graph = Graph(vertexDocumentLight);
    assert.deepEqual(graph.first(), vertexDocumentLight);
  });
  it('should have a valid add method', function() {
    graph = Graph();
    graph.add(vertexDocumentLight);
    assert.deepEqual(graph.first(), vertexDocumentLight);
    graph.add(graph);
    assert.deepEqual(graph.first(), vertexDocumentLight);
    assert.equal(Object.keys(graph.graph).length, 1);
  });
  it('should have a valid find method', function() {
    graph = Graph();
    assert.deepEqual(graph.find(), undefined);
    graph.add(vertexDocumentLight);
    assert.deepEqual(graph.find(), vertexDocumentLight);
    graph.add(vertexDocumentDark);
    assert.deepEqual(graph.find({ properties: { yellow: { value: 'Yellow light' } } }), vertexDocumentLight);
    assert.deepEqual(graph.find({ properties: { yellow: { value: 'Yellow dark' } } }), vertexDocumentDark);
  });
  it('should have a valid findAll method', function() {
    graph = Graph();
    assert.deepEqual(graph.findAll(), []);
    graph.add(vertexDocumentLight);
    graph.add(vertexDocumentDark);
    assert.deepEqual(graph.findAll(), [ vertexDocumentLight, vertexDocumentDark ]);
    assert.deepEqual(graph.findAll({ properties: { yellow: { value: 'Yellow light' } } }), [ vertexDocumentLight ]);
  });
  it('should have a valid delete method', function() {
    graph.delete({ properties: { yellow: { value: 'Yellow light' } } });
    graph.delete({ properties: { yellow: { value: 'Yellow dark' } } });
    assert.deepEqual(graph.find(), undefined);
  });
  it('should have a valid isEmpty method', function() {
    graph = Graph();
    assert.equal(graph.isEmpty(), true);
    graph.add(vertexDocumentLight);
    assert.equal(graph.isEmpty(), false);
  });
  it('should have a valid first method', function() {
    graph = Graph();
    assert.deepEqual(graph.first(), undefined);
    graph.add(vertexDocumentLight);
    assert.deepEqual(graph.first(), vertexDocumentLight);
    assert.deepEqual(graph.first('vertex', 'vertexLabelLight'), vertexDocumentLight);
  });
  it('should have a valid forEach method', function() {
    graph.forEach(function (doc) {
      assert.deepEqual(doc, vertexDocumentLight);
    });
  });
  it('should have a valid bindings method', function() {
    var bindings;
    bindings = graph.bindings();
    assert.deepEqual(bindings[Object.keys(bindings)[0]], {
      'uuid': bindings[Object.keys(bindings)[0]].uuid,
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
    });
  });
  it('should have a save method', function() {
    assert.equal(typeof graph.save, 'function');
  });
  it('should have a get method', function() {
    assert.equal(typeof graph.get, 'function');
  });
  it('should have a query method', function() {
    assert.equal(typeof graph.query, 'function');
  });
  it('should have a messageGraph method', function() {
    assert.equal(typeof Graph.messageGraph, 'function');
    assert.equal(typeof graph.messageGraph, 'function');
  });
});