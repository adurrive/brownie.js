# Global





* * *

### CompositeIndex(name, keys, unique, global) 

CompositeIndex class

Use a composite index for exact match index retrievals. Composite indexes do not require configuring or operating an external index system and are often significantly faster than mixed indexes.
As an exception, use a mixed index for exact matches when the number of distinct values for query constraint is relatively small or if one value is expected to be associated with many elements in the graph (i.e. in case of low selectivity).

**Parameters**

**name**: `String`, Name of the composite index

**keys**: `Object`, Properties to index

**unique**: `Boolean`, Define the index as unique

**global**: `Boolean`, Define the index as global or leave it limited to the model (label)




* * *










