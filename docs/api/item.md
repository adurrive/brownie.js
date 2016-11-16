# Global





* * *

### Item(schema, doc, enableScripts, fromTitan) 

Item class

**Parameters**

**schema**: `ItemSchema`, Item schema

**doc**: `Object`, Item document object

**enableScripts**: `Boolean`, Enable scripts dynamically setting the value of properties

**fromTitan**: `Boolean`, Document from Titan requiring special parsing



### addId(id) 

Add id

**Parameters**

**id**: `Number`, Id of the item in Titan



### addKey(key) 

Add key

**Parameters**

**key**: `String`, Key of the item



### addScript(script, bindings) 

Add script

**Parameters**

**script**: `Script | String`, Script to select items

**bindings**: `Object`, Bindings available in the script



### addVerify(script, bindings) 

Add verify

**Parameters**

**script**: `Script | String`, Verify script, must pass to save item

**bindings**: `Object`, Bindings available in the script



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

**doc**: `Object`, Item document object

**enableScripts**: `Boolean`, Enable scripts dynamically setting the value of properties

**fromTitan**: `Boolean`, Document from Titan requiring special parsing



### value(name) 

Get value

**Parameters**

**name**: `String`, Name of the property or item



### values() 

Get values



### generateKey() 

Generate key



### bindings(get) 

Get bindings

**Parameters**

**get**: `Boolean`, Bindings used to get versus save data from Titan



### delete() 

Delete item from Titan




* * *










