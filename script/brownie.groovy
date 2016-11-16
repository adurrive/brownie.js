// ******************************
// * Global functions
// ******************************

// Define the default TraversalSource to bind queries to
g = graph.traversal();

// Define function to get titan management
def mgmt() {
  graph.openManagement();
}

// Define function to get current date
def now() {
  new Date().time;
}

// ******************************
// * Brownie evaluate functions
// ******************************

// Define function to evaluate script
def brownieEvaluate(String $script, Object $bindingsArgument, $valueArgument, Boolean $removeArgument, Object $graphArgument, Object $documentArgument, Object $itemArgument, $thisArgument, $thisItemArgument, Traversal $inVArgument, Traversal $outVArgument) {
  // Define bindings
  bindings = $bindingsArgument;
  // Define global variables
  $now = now();
  $value = $valueArgument;
  $remove = $removeArgument;
  $graph = $graphArgument;
  $document = $documentArgument;
  $item = $itemArgument;
  $this = $thisArgument;
  $thisItem = $thisItemArgument;
  $outV = $outVArgument;
  $inV = $inVArgument;
  // Evaluate
  evaluate($script);
}

// ******************************
// * Brownie init functions
// ******************************

// Define function to get or create label
def brownieGetOrCreateLabel(String $labelName, String $type, Object $multiplicity, $mgmt) {
  def $label;
  if ($type == 'vertex') {
    $label = $mgmt.getVertexLabel($labelName);
    if (!$label) { 
      $label = $mgmt.makeVertexLabel($labelName).make(); 
    }
  } else if ($type == 'edge') {
    $label = $mgmt.getEdgeLabel($labelName);
    if (!$label) {
      if ($multiplicity == null) {
        throw new RuntimeException('Unknown ' + $labelName + ' edge label');
      }
      $label = $mgmt.makeEdgeLabel($labelName).multiplicity(Multiplicity[$multiplicity.name]).make();
    } else if ($multiplicity != null) {
      if ($label.multiplicity() != Multiplicity[$multiplicity.name]) {
        throw new RuntimeException('Wrong multiplicity for ' + $labelName + ' edge label');
      }
    }
  }
  $label;
};

// Define function to get or create property
def brownieGetOrCreateProperty(String $propertyName, Object $propertyType, Object $cardinality, $mgmt) {
  def PropertyKeyMaker $propertyKeyMaker;
  def PropertyKey $propertyKey;
  def Class $propertyClass;
  $propertyKey = $mgmt.getPropertyKey($propertyName);
  if (!$propertyKey) {
    if ($propertyType == null || $cardinality == null) {
      throw new RuntimeException('Unknown ' + $propertyName + ' property');
    }
    $propertyClass = $propertyType.titan == 'Geoshape' ? Geoshape.class : evaluate($propertyType.titan + '.class');
    $propertyKeyMaker = $mgmt.makePropertyKey($propertyName);
    $propertyKeyMaker.dataType($propertyClass);
    $propertyKeyMaker.cardinality(Cardinality[$cardinality.name]);
    $propertyKey = $propertyKeyMaker.make();
  } else if ($propertyType != null && $cardinality != null) {
    $propertyClass = $propertyType.titan == 'Geoshape' ? Geoshape.class : evaluate($propertyType.titan + '.class');
    if ($propertyKey.dataType() != $propertyClass) {
      throw new RuntimeException('Wrong data type ' + $propertyClass + ' for existing ' + $propertyName + ' property with data type ' + $propertyKey.dataType());
    }
    if ($propertyKey.cardinality() != Cardinality[$cardinality.name]) {
      throw new RuntimeException('Wrong cardinality ' + Cardinality[$cardinality.name] + ' for existing ' + $propertyName + ' property with cardinality ' + $propertyKey.cardinality());
    }
  }
  $propertyKey;
};

// Define function to create index
def brownieGetOrCreateIndex(Object $indexDefinition, String $type, $label, $mgmt) {
  def TitanManagement.IndexBuilder $indexBuilder;
  def TitanGraphIndex $index;
  def PropertyKey $propertyKey;
  $index = $mgmt.getGraphIndex($indexDefinition.name);
  if (!$index) {
    if ($type == 'vertex') {
      $indexBuilder = $mgmt.buildIndex($indexDefinition.name, Vertex.class);
    } else if ($type == 'edge') {
      $indexBuilder = $mgmt.buildIndex($indexDefinition.name, Edge.class);
    }
    // Add label
    if (!$indexDefinition.global && $label != null) {
      $indexBuilder.indexOnly($label);
    }
    if ($indexDefinition.index == 'composite') {
      // Add keys
      $indexDefinition.keys.each {
        String $key, Boolean $enabled ->
        $propertyKey = brownieGetOrCreateProperty($key, null, null, $mgmt);
        $indexBuilder.addKey($propertyKey);
        // Ensure only one property key per vertex
        if ($indexDefinition.unique) {
          $mgmt.setConsistency($propertyKey, ConsistencyModifier.LOCK);
        }
      }
      // Add unique
      if ($indexDefinition.unique) {
        $indexBuilder.unique();
      }
      // Build composite index
      $index = $indexBuilder.buildCompositeIndex();
      // Ensure indexed keys uniqueness in the graph
      if ($indexDefinition.unique) {        
        $mgmt.setConsistency($index, ConsistencyModifier.LOCK);
      }
    } else if ($indexDefinition.index == 'mixed') {
      // Add keys
      $indexDefinition.keys.each {
        String $key, Object $mapping ->
        $propertyKey = brownieGetOrCreateProperty($key, null, null, $mgmt);
        $indexBuilder.addKey($propertyKey, Mapping[$mapping.name].asParameter());
      }
      // Build mixed index
      $index = $indexBuilder.buildMixedIndex($indexDefinition.backendName);
    }
  } else {
    // Check indexed element
    if (($type == 'vertex' && $index.getIndexedElement() != TitanVertex) || ($type == 'edge' && $index.getIndexedElement() != TitanEdge)) {
      throw new RuntimeException('Wrong indexed element for ' + $indexDefinition.name + ' index');
    }
    if ($indexDefinition.index == 'composite') {
      // Check index type
      if (!$index.isCompositeIndex()) {
        throw new RuntimeException('Wrong index type for ' + $indexDefinition.name + ' index');
      }
      // Check keys
      $indexDefinition.keys.each {
        String $key, Boolean $enabled ->
        $propertyKey = brownieGetOrCreateProperty($key, null, null, $mgmt);
        if (!($propertyKey in $index.getFieldKeys())) {
          throw new RuntimeException('Missing ' + $key + ' key in ' + $indexDefinition.name + ' index');
        }
      }
      if ($index.getFieldKeys().size() != $indexDefinition.keys.size()) {
        throw new RuntimeException('Removed key still active in ' + $indexDefinition.name + ' index');
      }
      // Check uniqueness
      if ($index.isUnique() != !!$indexDefinition.unique) {
        throw new RuntimeException('Wrong uniqueness parameter for ' + $indexDefinition.name + ' index');
      }
      // Check backing index
      if ($index.getBackingIndex() != 'internalindex') {
        throw new RuntimeException('Wrong backing index for ' + $indexDefinition.name + ' index');
      }
    } else if ($indexDefinition.index == 'mixed') {
      // Check index type
      if (!$index.isMixedIndex()) {
        throw new RuntimeException('Wrong index type for ' + $indexDefinition.name + ' index');
      }
      // Check keys
      $indexDefinition.keys.each {
        String $key, Object $mapping ->
        $propertyKey = brownieGetOrCreateProperty($key, null, null, $mgmt);
        if (!($propertyKey in $index.getFieldKeys())) {
          throw new RuntimeException('Missing ' + $key + ' key in ' + $indexDefinition.name + ' index');
        }
        $index.getParametersFor($propertyKey).eachWithIndex {
          Object $parameter, Integer $parameterIndex ->
          if ($parameter.key() == 'mapping' && $parameter.value() != Mapping[$mapping.name]) {
            throw new RuntimeException('Wrong mapping for ' + $key + ' key in ' + $indexDefinition.name + ' index');
          }
        }
      }
      if ($index.getFieldKeys().size() != $indexDefinition.keys.size()) {
        throw new RuntimeException('Removed key still active in ' + $indexDefinition.name + ' index');
      }
      // Check backing index
      if ($index.getBackingIndex() != $indexDefinition.backendName) {
        throw new RuntimeException('Wrong backing index for ' + $indexDefinition.name + ' index');
      }
    }
  }
  $index;
};

// Define function to initialize model
def brownieInitializeModel(Object $model, $mgmt) {
  def $label;
  // Get or create label
  $label = brownieGetOrCreateLabel($model.label, $model.type, $model.schema.multiplicity, $mgmt);
  // Get or create properties
  $model.schema.properties.each {
    String $propertyName, Object $property ->
    brownieGetOrCreateProperty($propertyName, $property.type, $property.cardinality, $mgmt);
    if ($property.cardinality.name != 'SINGLE' && $property.properties != null) {
      $property.properties.each {
        String $itemPropertyName, Object $itemProperty ->
        brownieGetOrCreateProperty($itemPropertyName, $itemProperty.type, $itemProperty.cardinality, $mgmt);
      }
    }
  }
  // Get or create
  $model.schema.indices.eachWithIndex {
    Object $indexDefinition, Integer $indexDefinitionIndex ->
    brownieGetOrCreateIndex($indexDefinition, $model.type, $label, $mgmt);
  }
};

// Define function to initialize vertices and edges
def brownieInitialize(Object $vertices, Object $edges) {
  def $mgmt = mgmt();
  // Define properties
  brownieGetOrCreateProperty('@label', [ titan: 'String' ], [ name: 'SINGLE' ], $mgmt);
  brownieGetOrCreateProperty('@key', [ titan: 'String' ], [ name: 'SINGLE' ], $mgmt);
  brownieGetOrCreateProperty('@updatedAt', [ titan: 'Long' ], [ name: 'SINGLE' ], $mgmt);
  brownieGetOrCreateProperty('@createdAt', [ titan: 'Long' ], [ name: 'SINGLE' ], $mgmt);
  // Define indices
  brownieGetOrCreateIndex([
    'index': 'composite',
    'name': 'byVertexLabelKey',
    'keys': [
      '@label': true,
      '@key': true
    ],
    'unique': true,
    'global': true
  ], 'vertex', null, $mgmt);
  brownieGetOrCreateIndex([
    'index': 'composite',
    'name': 'byEdgeLabelKey',
    'keys': [
      '@label': true,
      '@key': true
    ],
    'unique': false,
    'global': true
  ], 'edge', null, $mgmt);
  // Initialize vertices
  $vertices.each {
    String $labelName, Object $model ->
    brownieInitializeModel($model, $mgmt);
  }
  // Initialize edges
  $edges.each {
    String $labelName, Object $model ->
    brownieInitializeModel($model, $mgmt);
  }
  $mgmt.commit();
};

// ******************************
// * Brownie get functions
// ******************************

// Define function to get element traversal
def brownieGetElementTraversalForGet(Object $traversals, Object $graph, String $uuid) {
  def Traversal $outV;
  def Traversal $inV;
  if ($traversals[$uuid] == null) {
    // Get vertices from database
    if ($graph[$uuid].type == 'vertex') {
      if ($graph[$uuid].id != null) {
        $traversals[$uuid] = g.V($graph[$uuid].id).has('@label', $graph[$uuid].label);
      } else if ($graph[$uuid].script != null) {
        $traversals[$uuid] = brownieEvaluate($graph[$uuid].script.script, $graph[$uuid].script.bindings, null, null, $graph, $graph[$uuid], null, null, null, null, null);
        if (!($traversals[$uuid] instanceof Traversal)) {
          $traversals[$uuid] = g.V($traversals[$uuid]).has('@label', $graph[$uuid].label);
        } else {
          $traversals[$uuid] = $traversals[$uuid].has('@label', $graph[$uuid].label);
        }
      } else if ($graph[$uuid].key != null) {
        $traversals[$uuid] = g.V().has('@label', $graph[$uuid].label).has('@key', $graph[$uuid].key);
      } else if (!$graph[$uuid].keys.size()) {
        $traversals[$uuid] = g.V().has('@label', $graph[$uuid].label);
      } else {
        throw new RuntimeException('Vertices cannot be identified');
      }
    } else {
      // Get out vertex
      if ($graph[$uuid].outV) {
        $outV = brownieGetElementTraversalForGet($traversals, $graph, $graph[$uuid].outV.uuid).clone();
      } else {
        $outV = null;
      }
      // Get in vertex
      if ($graph[$uuid].inV) {
        $inV = brownieGetElementTraversalForGet($traversals, $graph, $graph[$uuid].inV.uuid).clone();
      } else {
        $inV = null;
      }
      if ($graph[$uuid].id != null) {
        $traversals[$uuid] = g.E($graph[$uuid].id).has('@label', $graph[$uuid].label);
      } else if ($graph[$uuid].script != null) {
        $traversals[$uuid] = brownieEvaluate($graph[$uuid].script.script, $graph[$uuid].script.bindings, null, null, $graph, $graph[$uuid], null, null, null, $outV, $inV);
        if (!($traversals[$uuid] instanceof Traversal)) {
          $traversals[$uuid] = g.E($traversals[$uuid]).has('@label', $graph[$uuid].label);
        } else {
          $traversals[$uuid] = $traversals[$uuid].has('@label', $graph[$uuid].label);
        }
      } else if ($graph[$uuid].key != null) {
        if ($outV != null && $inV != null) {
          $traversals[$uuid] = $outV.outE($graph[$uuid].label).has('@label', $graph[$uuid].label).has('@key', $graph[$uuid].key).as('e').outV().where($inV).select('e');
        } else if ($outV != null) {
          $traversals[$uuid] = $outV.outE($graph[$uuid].label).has('@label', $graph[$uuid].label).has('@key', $graph[$uuid].key);
        } else if ($inV != null) {
          $traversals[$uuid] = $inV.inE($graph[$uuid].label).has('@label', $graph[$uuid].label).has('@key', $graph[$uuid].key);
        } else {
          throw new RuntimeException('Edge cannot be identified');
        }
      } else {
        if ($outV != null && $inV != null) {
          $traversals[$uuid] = $outV.outE($graph[$uuid].label).has('@label', $graph[$uuid].label).as('e').outV().where($inV).select('e');
        } else if ($outV != null) {
          $traversals[$uuid] = $outV.outE($graph[$uuid].label).has('@label', $graph[$uuid].label);
        } else if ($inV != null) {
          $traversals[$uuid] = $inV.inE($graph[$uuid].label).has('@label', $graph[$uuid].label);
        } else {
          throw new RuntimeException('Edge cannot be identified');
        }
      }
    }
  }
  // Return traversal
  $traversals[$uuid];
}

// Define function to get graph
def brownieGetGraph(Object $graph) {
  def Object $cache;
  def Object $traversals;
  def Object $ids;
  def ArrayList $results;
  // Merge edge vertices
  $cache = [:];
  $graph.each {
    String $uuid, Object $document ->
    if ($document.type == 'edge') {
      if ($document.outV && !$graph[$document.outV.uuid] && !$cache[$document.outV.uuid]) {
        $cache[$document.outV.uuid] = $document.outV;
      }
      if ($document.inV && !$graph[$document.inV.uuid] && !$cache[$document.inV.uuid]) {
        $cache[$document.inV.uuid] = $document.inV;
      }
    }
  }
  $cache.each {
    String $uuid, Object $document ->
    $graph[$uuid] = $document;
  }
  // Get graph traversals
  $traversals = [:];
  $graph.each {
    String $uuid, Object $document ->
    brownieGetElementTraversalForGet($traversals, $graph, $uuid);
  }
  // Get graph
  $ids = [:]
  $results = [];
  $traversals.each {
    String $uuid, Traversal $traversal ->
    $traversal.each {
      $this ->
      // Check verify script
      if (!$ids[$this.id()] && ($graph[$uuid].verify == null || brownieEvaluate($graph[$uuid].verify.script, $graph[$uuid].verify.bindings, null, null, $graph, $graph[$uuid], null, $this, null, null, null))) {
        $ids[$this.id()] = true;
        $results.push($this);
      }
    }
  }
  // Return the results
  $results;
}

// ******************************
// * Brownie save functions
// ******************************

// Define function to get element traversal
def brownieGetElementTraversalForSave(Object $traversals, Object $graph, String $uuid) {
  def Traversal $outV;
  def Traversal $inV;
  if ($traversals[$uuid] == null) {
    // Get vertices from database
    if ($graph[$uuid].type == 'vertex') {
      if ($graph[$uuid].id != null) {
        $traversals[$uuid] = g.V($graph[$uuid].id).has('@label', $graph[$uuid].label);
      } else if ($graph[$uuid].script != null) {
        $traversals[$uuid] = brownieEvaluate($graph[$uuid].script.script, $graph[$uuid].script.bindings, null, !!$graph[$uuid].remove, $graph, $graph[$uuid], null, null, null, null, null);
        if (!($traversals[$uuid] instanceof Traversal)) {
          $traversals[$uuid] = g.V($traversals[$uuid]);
        }
        $traversals[$uuid] = $traversals[$uuid].has('@label', $graph[$uuid].label);
      } else if ($graph[$uuid].key != null) {
        $traversals[$uuid] = g.V().has('@label', $graph[$uuid].label).has('@key', $graph[$uuid].key);
      } else if (!$graph[$uuid].keys.size() && !$graph[$uuid].duplicate) {
        $traversals[$uuid] = g.V().has('@label', $graph[$uuid].label);
      } else {
        throw new RuntimeException('Vertices cannot be identified');
      }
    } else {
      // Get out vertex
      if ($graph[$uuid].outV) {
        $outV = brownieGetElementTraversalForSave($traversals, $graph, $graph[$uuid].outV.uuid).clone();
      } else {
        $outV = null;
      }
      // Get in vertex
      if ($graph[$uuid].inV) {
        $inV = brownieGetElementTraversalForSave($traversals, $graph, $graph[$uuid].inV.uuid).clone();
      } else {
        $inV = null;
      }
      if ($graph[$uuid].id != null) {
        $traversals[$uuid] = g.E($graph[$uuid].id).has('@label', $graph[$uuid].label);
      } else if ($graph[$uuid].script != null) {
        $traversals[$uuid] = brownieEvaluate($graph[$uuid].script.script, $graph[$uuid].script.bindings, null, !!$graph[$uuid].remove, $graph, $graph[$uuid], null, null, null, $outV, $inV);
        if (!($traversals[$uuid] instanceof Traversal)) {
         $traversals[$uuid] = g.E($traversals[$uuid]);
        }
        $traversals[$uuid] = $traversals[$uuid].has('@label', $graph[$uuid].label);
      } else if ($graph[$uuid].key != null) {
        if ($outV != null && $inV != null) {
          $traversals[$uuid] = $outV.outE($graph[$uuid].label).has('@label', $graph[$uuid].label).has('@key', $graph[$uuid].key).as('e').outV().where($inV).select('e');
        } else if ($outV != null) {
          $traversals[$uuid] = $outV.outE($graph[$uuid].label).has('@label', $graph[$uuid].label).has('@key', $graph[$uuid].key);
        } else if ($inV != null) {
          $traversals[$uuid] = $inV.inE($graph[$uuid].label).has('@label', $graph[$uuid].label).has('@key', $graph[$uuid].key);
        } else {
          throw new RuntimeException('Edge cannot be identified');
        }
      } else if (!$graph[$uuid].duplicate) {
        if ($outV != null && $inV != null) {
          $traversals[$uuid] = $outV.outE($graph[$uuid].label).has('@label', $graph[$uuid].label).as('e').outV().where($inV).select('e');
        } else if ($outV != null) {
          $traversals[$uuid] = $outV.outE($graph[$uuid].label).has('@label', $graph[$uuid].label);
        } else if ($inV != null) {
          $traversals[$uuid] = $inV.inE($graph[$uuid].label).has('@label', $graph[$uuid].label);
        } else {
          throw new RuntimeException('Edge cannot be identified');
        }
      } else {
        throw new RuntimeException('Edge cannot be identified');
      }
    }
  }
  // Return traversal
  $traversals[$uuid];
}

// Define function to create document
def brownieCreateDocument(Object $documents, Object $graph, String $uuid, $this, String $i) {
  def Boolean $blocked;
  def Object $document;
  // Check verify script
  if ($graph[$uuid].verify != null && !brownieEvaluate($graph[$uuid].verify.script, $graph[$uuid].verify.bindings, null, !!$graph[$uuid].remove, $graph, $graph[$uuid], null, $this, null, null, null)) {
    return;
  }
  // Check thresholds
  if ($graph[$uuid].thresholds.size()) {
    $graph[$uuid].thresholds.eachWithIndex {
      String $thresholdName, Integer $thresholdNameIndex ->
      if ($this && $graph[$uuid].properties && $graph[$uuid].properties[$thresholdName] && $graph[$uuid].properties[$thresholdName].value > 0 && $graph[$uuid].properties[$thresholdName].value < $this.value($thresholdName)) {
        $blocked = true;
      }
    }
    if ($blocked) {
      return;
    }
  }
  // Define document
  $document = [
    newUuid: $uuid + '-' + $i,
    this: $this,
    type: $graph[$uuid].type,
    label: $graph[$uuid].label
  ];
  if (!$graph[$uuid].remove) {
    if (!$document.this) {
      if ($graph[$uuid].key != null || !$graph[$uuid].keys.size()) {
        $document.key = $graph[$uuid].key;
        $document.update = true;
        $document.create = true;
        $document.duplicate = $graph[$uuid].duplicate;
        // Edge
        if ($graph[$uuid].type == 'edge') {
          if ($graph[$uuid].outV) {
            $document.outV = [ uuid: $graph[$uuid].outV.uuid ];
          }
          if ($graph[$uuid].inV) {
            $document.inV = [ uuid: $graph[$uuid].inV.uuid ];
          }
        }
      } else {
        return;
      }
    }
    // Define document properties
    $document.properties = [:];
    $graph[$uuid].properties.each {
      String $propertyName, Object $property ->
      def $documentItems;
      // Define document property
      if (!($property instanceof ArrayList)) {
        if (!$property.remove) {
          if ($property.increment != null) {
            if ($document.this && $document.this.properties($propertyName).hasNext()) {
              $document.properties[$propertyName] = [ value: $document.this.value($propertyName) + $property.increment.value ];
            } else if ($property.init != null) {
              $document.properties[$propertyName] = [ value: $property.init + $property.increment.value ];
            } else {
              $document.properties[$propertyName] = [ value: $property.increment.value ];
            }
          } else {
            if ($property.script != null) {
              $property.value = brownieEvaluate($property.script.script, $property.script.bindings, null, false, $graph, $graph[$uuid], null, $document.this, null, null, null);
            }
            if ($property.value != null && (!$document.this || !$document.this.properties($propertyName).hasNext() || $property.value != $document.this.value($propertyName))) {
              $document.properties[$propertyName] = [ value: $property.value ];
            } else if ($property.value == null && $property.init != null && !$document.this) {
              $document.properties[$propertyName] = [ value: $property.init ];
            }
          }
        } else if ($document.this && $document.this.properties($propertyName).hasNext()) {
          $document.properties[$propertyName] = [ remove: true ];
        }
        if ($document.properties[$propertyName]) {
          if ($property.pre != null) {
            $document.properties[$propertyName].pre = $property.pre;
            $document.pre = true;
          }
          if ($property.post != null) {
            $document.properties[$propertyName].post = $property.post;
            $document.post = true;
          }
          if ($document.this && $propertyName in $graph[$uuid].keys) {
            $document.updateKey = true;
            $document.keys = $graph[$uuid].keys;
          }
        }
      // Define document item
      } else if ($property.size()) {
        $documentItems = [];
        $property.eachWithIndex {
          Object $item, Integer $itemIndex ->
          def $traversalItem;
          if ($document.this) {
            if ($item.id != null) {
              $traversalItem = g.V($document.this).properties($propertyName).hasId($item.id);
            } else if ($item.script != null) {
              $traversalItem = brownieEvaluate($item.script.script, $item.script.bindings, null, !!$item.remove, $graph, $graph[$uuid], $item, $document.this, null, null, null);
              if (!($traversalItem instanceof Traversal)) {
                $traversalItem = g.V($document.this).properties($propertyName).hasId($traversalItem.id());
              }
            } else if ($item.key != null && !$item.duplicate) {
              $traversalItem = g.V($document.this).properties($propertyName).hasValue($item.key);
            } else {
              throw new RuntimeException('Item in property ' + $propertyName + ' cannot be identified'); 
            }
          }
          if ($traversalItem) {
            $traversalItem.each {
              $thisItem ->
              brownieCreateDocumentItem($document, $documentItems, $graph, $item, $thisItem);
            }
          } else {
            brownieCreateDocumentItem($document, $documentItems, $graph, $item, null);
          }
        }
        if ($documentItems.size()) {
          $document.properties[$propertyName] = $documentItems;
        }
      } else {
        // Remove all items
        if ($document.this && $document.this.properties($propertyName).hasNext()) {
          $document.properties[$propertyName] = [];
        }
      }
    }
    if ($document.properties.size()) {
      $document.update = true;
    }
  } else if ($document.this) {
    $document.remove = true;
  }
  // Save document (including without update or remove for inV/outV reference)
  $documents[$uuid + '-' + $i] = $document;
}

// Define function to create item
def brownieCreateDocumentItem(Object $document, Object $documentItems, Object $graph, Object $item, Property $thisItem) {
  def Boolean $blocked;
  def Object $documentItem;
  // Check verify script
  if ($item.verify != null && !brownieEvaluate($item.verify.script, $item.verify.bindings, null, !!$item.remove, $graph, $graph[$document.uuid], $item, $document.this, $thisItem, null, null)) {
    return;
  }
  // Check thresholds
  if ($item.thresholds.size()) {
    $item.thresholds.eachWithIndex {
      String $itemThresholdName, Integer $itemThresholdNameIndex ->
      if ($thisItem && $item.properties && $item.properties[$itemThresholdName] && $item.properties[$itemThresholdName].value > 0 && $item.properties[$itemThresholdName].value < $thisItem.value($itemThresholdName)) {
        $blocked = true;
      }
    }
    if ($blocked) {
      return;
    }
  }
  // Define document item
  $documentItem = [
    thisItem: $thisItem
  ];
  if (!$item.remove) {
    if (!$thisItem) {
      if ($item.key != null) {
        $documentItem.key = $item.key;
        $documentItem.update = true;
        $documentItem.create = true;
        $documentItem.duplicate = $item.duplicate;
      } else {
        return;
      }
    }
    // Define document item properties
    $documentItem.properties = [:];
    $item.properties.each {
      String $itemPropertyName, Object $itemProperty ->
      // Define document item property
      if (!$itemProperty.remove) {
        if ($itemProperty.increment != null) {
          if ($thisItem && $thisItem.properties($itemPropertyName).hasNext()) {
            $documentItem.properties[$itemPropertyName] = [ value: $thisItem.value($itemPropertyName) + $itemProperty.increment.value ];
          } else if ($itemProperty.init != null) {
            $documentItem.properties[$itemPropertyName] = [ value: $itemProperty.init + $itemProperty.increment.value ];
          } else {
            $documentItem.properties[$itemPropertyName] = [ value: $itemProperty.increment.value ];
          }
        } else {
          if ($itemProperty.script != null) {
            $itemProperty.value = brownieEvaluate($itemProperty.script.script, $itemProperty.script.bindings, null, !!$item.remove, $graph, $graph[$document.uuid], $item, $document.this, $thisItem, null, null);
          }
          if ($itemProperty.value != null && (!$thisItem || !$thisItem.properties($itemPropertyName).hasNext() || $itemProperty.value != $thisItem.value($itemPropertyName))) {
            $documentItem.properties[$itemPropertyName] = [ value: $itemProperty.value ];
          } else if ($itemProperty.value == null && $itemProperty.init != null && !$thisItem) {
            $documentItem.properties[$itemPropertyName] = [ value: $itemProperty.init ];
          }
        }
      } else if ($thisItem && $thisItem.properties($itemPropertyName).hasNext()) {
        $documentItem.properties[$itemPropertyName] = [ remove: true ];
      }
      if ($documentItem.properties[$itemPropertyName]) {
        if ($itemProperty.pre != null) {
          $documentItem.properties[$itemPropertyName].pre = $itemProperty.pre;
          $documentItem.pre = true;
          $document.pre = true;
        }
        if ($itemProperty.post != null) {
          $documentItem.properties[$itemPropertyName].post = $itemProperty.post;
          $documentItem.post = true;
          $document.post = true;
        }
        if ($document.this && $thisItem && $itemPropertyName in $item.keys) {
          $documentItem.updateItemKey = true;
          $documentItem.keys = $item.keys;
        }
      }
    }
    if ($documentItem.properties.size()) {
      $documentItem.update = true;
    }
  } else if ($thisItem) {
    $documentItem.remove = true;
  }
  //Save document item
  if ($documentItem.update || $documentItem.remove) {
    $documentItems.push($documentItem);
  }
}

// Define function to execute pre-scripts or post-scripts
def brownieExecutePrePostScripts(Object $graph, Object $documents, String $type) {
  $documents.each {
    String $newUuid, Object $document ->
    if ($document[$type]) {
      $document.properties.each {
        String $propertyName, Object $property ->
        if (!($property instanceof ArrayList)) {
          if ($property[$type]) {
            brownieEvaluate($property[$type].script, $property[$type].bindings, $property.value, !!$property.remove, $graph, $document, null, $document.this, null, null, null);
          }
        } else if ($property.size()) {
          $property.eachWithIndex {
            Object $item, Integer $itemIndex ->
            if ($item[$type]) {
              $item.properties.each {
                String $itemPropertyName, Object $itemProperty ->
                if ($itemProperty[$type]) {
                  brownieEvaluate($itemProperty[$type].script, $itemProperty[$type].bindings, $itemProperty.value, !!$itemProperty.remove, $graph, $document, $item, $document.this, $item.thisItem, null, null);
                }
              }
            }
          }
        }
      }
    }
  }
}

// Define function to create or remove element
def brownieCreateElement(Object $documents, String $newUuid) {
  def $outV;
  def $inV;
  def $now = now();
  def Object $document;
  $document = $documents[$newUuid];
  if ($document && !$document.remove) {
    if ($document.create && !$document.this) {
      // Create vertex
      if ($document.type == 'vertex') {
        if ($document.key != null) {
          // Double-check in case it has already been created in this transaction
          $document.this = g.V().has('@label', $document.label).has('@key', $document.key);
          if ($document.this.hasNext()) {
            $document.this = $document.this.next();
          } else {
            $document.this = graph.addVertex(label, $document.label, '@label', $document.label, '@key', $document.key, '@createdAt', $now);
          }
        } else if (!$document.duplicate) {
          // Double-check in case it has already been created in this transaction
          $document.this = g.V().has('@label', $document.label).limit(1);
          if ($document.this.hasNext()) {
            $document.this = $document.this.next();
          } else {
            $document.this = graph.addVertex(label, $document.label, '@label', $document.label, '@createdAt', $now);
          }
        } else {
          $document.this = graph.addVertex(label, $document.label, '@label', $document.label, '@createdAt', $now);
        }
      // Create edge
      } else if ($document.outV && $document.inV) {
        if ($documents[$document.outV.uuid + '-1']) {
          throw new RuntimeException('Edge cannot be created from multiple vertices');
        }
        if ($documents[$document.inV.uuid + '-1']) {
          throw new RuntimeException('Edge cannot be created to multiple vertices');
        }
        $outV = brownieCreateElement($documents, $document.outV.uuid + '-0');
        $inV = brownieCreateElement($documents, $document.inV.uuid + '-0');
        if ($outV && $inV) {
          if ($document.key != null) {
            // Double-check in case it has already been created in this transaction
            $document.this = g.V($outV).outE($document.label).has('@label', $document.label).has('@key', $document.key).as('e').inV().is($inV).select('e');
            if ($document.this.hasNext()) {
              $document.this = $document.this.next();
            } else {
              $document.this = $outV.addEdge($document.label, $inV, '@label', $document.label, '@key', $document.key, '@createdAt', $now);
            }
          } else if (!$document.duplicate) {
            // Double-check in case it has already been created in this transaction
            $document.this = g.V($outV).outE($document.label).has('@label', $document.label).as('e').inV().is($inV).select('e');
            if ($document.this.hasNext()) {
              $document.this = $document.this.next();
            } else {
              $document.this = $outV.addEdge($document.label, $inV, '@label', $document.label, '@createdAt', $now);
            }
          } else {
            $document.this = $outV.addEdge($document.label, $inV, '@label', $document.label, '@createdAt', $now);
          }
        }
      }
    }
    $document.this;
  }
}

// Define function to get key
def brownieGetKey(ArrayList $keys, String $split, $this) {
  def ArrayList $key = [];
  $keys.eachWithIndex {
    String $propertyName, Integer $propertyNameIndex ->
    $key.push((String) $this.value($propertyName));
  }
  $key.join($split);
}

// Define function to change item key
def brownieChangeItemKey(Object $this, String $propertyName, Object $documentItem, String $split) {
  def $thisNewItem;
  // Create new item
  $thisNewItem = $this.property($propertyName, brownieGetKey($documentItem.keys, $split, $documentItem.thisItem));
  // Copy properties
  $documentItem.thisItem.properties().eachWithIndex {
    Property $itemProperty, Integer $itemPropertyIndex ->
    $thisNewItem.property($itemProperty.key(), $itemProperty.value());
  }
  // Delete old item
  // Bug: $documentItem.thisItem.remove();
  g.V($this).properties($propertyName).hasId($documentItem.thisItem.id()).next().remove();
  // Update item object
  $documentItem.thisItem = $thisNewItem;
}

// Define function to save graph
def brownieSaveGraph(Object $graph, Object $settings) {
  def Object $cache;
  def Object $traversals;
  def Object $documents;
  def Object $ids;
  def ArrayList $results;
  def $now = now();
  // Merge edge vertices
  $cache = [:];
  $graph.each {
    String $uuid, Object $document ->
    if ($document.type == 'edge') {
      if ($document.outV && !$graph[$document.outV.uuid] && !$cache[$document.outV.uuid]) {
        $cache[$document.outV.uuid] = $document.outV;
      }
      if ($document.inV && !$graph[$document.inV.uuid] && !$cache[$document.inV.uuid]) {
        $cache[$document.inV.uuid] = $document.inV;
      }
    }
  }
  $cache.each {
    String $uuid, Object $document ->
    $graph[$uuid] = $document;
  }
  // Get graph traversals
  $traversals = [:];
  $graph.each {
    String $uuid, Object $document ->
    brownieGetElementTraversalForSave($traversals, $graph, $uuid);
  }
  // Get documents
  $documents = [:];
  $traversals.each {
    String $uuid, Traversal $traversal ->
    def Integer $i;
    $i = 0;
    if ($traversal.hasNext()) {
      $traversal.each {
        $this ->
        brownieCreateDocument($documents, $graph, $uuid, $this, $i.toString());
        $i++;
      }
    } else {
      brownieCreateDocument($documents, $graph, $uuid, null, $i.toString());
    }
  }
  // Execute pre-scripts
  brownieExecutePrePostScripts($graph, $documents, 'pre');
  // Update graph
  $documents.each {
    String $newUuid, Object $document ->
    // Create and update document
    if ($document.update) {
      if ($document.create) {
        brownieCreateElement($documents, $newUuid);
      }
      if ($document.this) {
        $document.properties.each {
          String $propertyName, Object $property ->
          if (!($property instanceof ArrayList)) {
            if (!$property.remove) {
              $document.this.property($propertyName, $property.value);
            } else {
              $document.this.property($propertyName).remove();
            }
          } else if ($property.size()) {
            $property.eachWithIndex {
              Object $documentItem, Integer $documentItemIndex ->
              // Create and update item
              if ($documentItem.update) {
                if ($documentItem.create) {
                  if (!$documentItem.duplicate) {
                    // Double-check in case it has already been created in this transaction
                    $documentItem.thisItem = g.V($document.this).properties($propertyName).hasValue($documentItem.key);
                    if ($documentItem.thisItem.hasNext()) {
                      $documentItem.thisItem = $documentItem.thisItem.next();
                    } else {
                      $documentItem.thisItem = $document.this.property($propertyName, $documentItem.key);
                      $documentItem.thisItem.property('@createdAt', $now);
                    }
                  } else {
                    $documentItem.thisItem = $document.this.property($propertyName, $documentItem.key);
                    $documentItem.thisItem.property('@createdAt', $now);
                  }
                }
                // Update item properties
                $documentItem.properties.each {
                  String $documentItemPropertyName, Object $documentItemProperty ->
                  if (!$documentItemProperty.remove) {
                    $documentItem.thisItem.property($documentItemPropertyName, $documentItemProperty.value);
                  } else {
                    // Bug: $documentItem.thisItem.property($documentItemPropertyName).remove();
                    g.V($document.this).properties($propertyName).hasId($documentItem.thisItem.id()).next().property($documentItemPropertyName).remove();
                  }
                }
                $documentItem.thisItem.property('@updatedAt', $now);
                if ($documentItem.updateItemKey) {
                  brownieChangeItemKey($document.this, $propertyName, $documentItem, $settings.split);
                }
              // Remove item
              } else if ($documentItem.remove) {
                // Bug: $documentItem.thisItem.remove();
                g.V($document.this).properties($propertyName).hasId($documentItem.thisItem.id()).next().remove();
              }
            }
          } else {
            // Remove all items
            // Bug: g.V($document.this).properties($propertyName).drop();
            g.V($document.this).properties($propertyName).each {
              $thisItem ->
              $thisItem.remove();
            }
          }
        }
        $document.this.property('@updatedAt', $now);
        if ($document.updateKey) {
          String $newKey = brownieGetKey($document.keys, $settings.split, $document.this);
          // Change key, should fail if duplicate exists because of key uniqueness
          try {
            $document.property('@key', $newKey);
          } catch (e) {
            throw new RuntimeException('Cannot update key to ' + $newKey + ', document with key ' + $newKey + ' already exists: ' + e);
          }
        }
      }
    // Remove document
    } else if ($document.remove) {
      $document.this.remove();
    }
  }
  // Execute pre-scripts
  brownieExecutePrePostScripts($graph, $documents, 'post');
  // Return the updated graph
  if ($settings.get) {
    $ids = [:];
    $results = [];
    $documents.each {
      String $newUuid, Object $document ->
      if ($document.this && !$document.remove && !$ids[$document.this.id()]) {
        $ids[$document.this.id()] = true;
        $results.push($document.this);
      }
    }
  } else {
    $results = null;
  }
  // Return the results
  $results;
}

// ******************************
// * Brownie search functions
// ******************************

// Define function to search query
def brownieSearch(String $elementIdentifier, String $index, String $field, String $query, Integer $limit, Integer $offset, String $filter) {
  def Object $results;

  // Get Elasticsearch results
  $results = graph.indexQuery($index, $elementIdentifier + $field + ':(' + $query + ')' + $filter).setElementIdentifier($elementIdentifier).offset($offset).limit($limit).vertices();

  // Get response
  $results.collect {
    def Object $result = [:];
    $result.score = it.getScore();
    $result.document = it.getElement();
    $result;
  };
}