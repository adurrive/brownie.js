# Global





* * *

### Brownie() 

Brownie class

The exports object of the `brownie` module is an instance of this class.
Most apps will only use one instance.



### connect(settings) 

Connect to the gremlin server

**Parameters**

**settings**: `Object`, Settings for the `brownie` module



### model(label, schema) 

Define a model or retrieves it

**Parameters**

**label**: `String`, Label of the model in Titan

**schema**: `VertexSchema | EdgeSchema`, Schema of the model



### initialize() 

Initialize all current models in Titan



### execute(script, bindings) 

Execute a custom script on the gremlin server

**Parameters**

**script**: `Script | String`, Script to execute

**bindings**: `Object`, Bindings available in the script



### query(params) 

Directly query the Elasticsearch index through Titan

**Parameters**

**params**: `Object`, Parameters of the search



### messageStream(script, bindings) 

Execute a custom script on the gremlin server and return a stream

**Parameters**

**script**: `Script | String`, Script to execute

**bindings**: `Object`, Bindings available in the script



### messageGraph(script, bindings) 

Execute a custom script on the gremlin server and return a graph automatically inferred from the array of results

**Parameters**

**script**: `Script | String`, Script to execute

**bindings**: `Object`, Bindings available in the script



### VertexSchema() 

Vertex Schema constructor



### EdgeSchema() 

Edge Schema constructor



### Graph() 

Graph constructor



### Script() 

Script constructor



### Increment() 

Increment constructor



### Geoshape() 

Geoshape constructor



### CompositeIndex() 

CompositeIndex constructor



### MixedIndex() 

MixedIndex constructor



### Types() 

Types



### Multiplicities() 

Multiplicities



### Mappings() 

Mappings



### Cardinalities() 

Cardinalities




* * *










