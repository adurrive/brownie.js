# Global





* * *

### Graph(element, fromTitan) 

Graph class

**Parameters**

**element**: `VertexDocument | EdgeDocument | Graph | Object | Array`, Element to add to the graph

**fromTitan**: `Boolean`, Documents from Titan requiring special parsing



### add(element, fromTitan) 

Add element to the graph

**Parameters**

**element**: `VertexDocument | EdgeDocument | Graph | Object | Array`, Element to add to the graph

**fromTitan**: `Boolean`, Documents from Titan requiring special parsing



### first(type, label) 

Get the first document of the local graph

**Parameters**

**type**: `String`, Filter by type: vertex or edge

**label**: `String`, Filter by label



### forEach(callback) 

Call function on each document of the local graph

**Parameters**

**callback**: `function`, Function to call on each document of the graph



### find(expr) 

Find document in local graph

**Parameters**

**expr**: `Object`, Find the first document matching this expression



### findAll(expr) 

Find documents in local graph

**Parameters**

**expr**: `Object`, Find all documents matching this expression



### isEmpty() 

Check if the local graph is empty



### delete(doc) 

Delete documents from local graph

**Parameters**

**doc**: `String | Object`, Uuid or expression to find documents



### bindings(get) 

Get bindings

**Parameters**

**get**: `Boolean`, Bindings used to get versus save data from Titan



### save(get) 

Save graph

**Parameters**

**get**: `Boolean`, Return the updated graph from Titan when successfully saved



### get() 

Get graph



### query(params) 

Query direct index

**Parameters**

**params**: `Object`, Search parameters: elementIdentifier, index, field, query, filter, offset and limit



### messageGraph(script, bindings) 

Message graph

**Parameters**

**script**: `String | Script`, Script to execute

**bindings**: `Object`, Bindings available in the script




* * *










