# Global





* * *

### Document(doc, fromTitan) 

Document class

**Parameters**

**doc**: `Object`, Document object

**fromTitan**: `Boolean`, Document from Titan requiring special parsing



### addId(id) 

Add id

**Parameters**

**id**: `Number`, Id of the document in Titan



### addKey(key) 

Add key

**Parameters**

**key**: `String`, Key of the document



### addScript(script, bindings) 

Add script

**Parameters**

**script**: `Script | String`, Script to select documents

**bindings**: `Object`, Bindings available in the script



### addVerify(script, bindings) 

Add verify

**Parameters**

**script**: `Script | String`, Verify script, must pass to get or save document

**bindings**: `Object`, Bindings available in the script



### addScore(score) 

Add score

**Parameters**

**score**: `Number`, Elasticsearch score given to the result



### addProperty(name, value, enableScripts, fromTitan) 

Add property

**Parameters**

**name**: `String`, Name of the property

**value**: `any`, Value of the property or script if explicitly enabled

**enableScripts**: `Boolean`, Enable scripts dynamically setting the value of the property

**fromTitan**: `Boolean`, Document from Titan requiring special parsing



### addProperties(doc, enableScripts, fromTitan) 

Add properties

**Parameters**

**doc**: `Object`, Document object

**enableScripts**: `Boolean`, Enable scripts dynamically setting the value of properties

**fromTitan**: `Boolean`, Document from Titan requiring special parsing



### value(name, itemFilter, itemRankingProperty, itemFilterFallback) 

Get value

**Parameters**

**name**: `String`, Name of the property or item

**itemFilter**: `function | Object | Array | String`, Predicate used to filter items with the lodash filter method

**itemRankingProperty**: `String`, Return one item with the highest rank based on this property

**itemFilterFallback**: `Boolean`, Return all items if no item is returned by the filter



### values() 

Get all values



### generateKey() 

Generate key



### bindings(get, graph) 

Get bindings

**Parameters**

**get**: `Boolean`, Bindings used to get versus save data from Titan

**graph**: `Boolean`, In and out vertices have already been added independently to the graph and need not to be included



### delete() 

Delete document from Titan




* * *










