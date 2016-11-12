[![NPM](https://nodei.co/npm/brownie.png?downloads=true)](https://nodei.co/npm/brownie/)

Brownie.js
==========

Object-to-graph mapper for Titan 1.0

Install
=======

Copy script/brownie.groovy into titan's scripts folder then modify gremlin-server.yaml to add scripts/brownie.groovy to the gremlin-groovy script engines.

Quick start
===========

## Connecting

```js
  var brownie = require('brownie');

  var settings = {
    connection: {
      port: 8182,
      host: 'localhost',
      reconnect: 10,
      reconnectInterval: 1000,
      retryOnWebSocketError: 10,
      retryOnWebSocketErrorInterval: 5000,
      retryOnUniquenessError: 10,
      retryOnUniquenessErrorInterval: 200,
      retryOnError: 1,
      retryOnErrorInterval: 1000,
      options: {
        session: false,
        language: 'gremlin-groovy',
        op: 'eval',
        processor: '',
        accept: 'application/json'
      }
    },
    search: {
      elementIdentifier: '$vertex$',
      offset: 0,
      limit: 10
    },
    split: '|',
    initialize: true,
    strict: false,
    log: 1
  };

  brownie.connect(settings)
  .then(function () {
    ...
  })
```

## Simple Schema Definition

```js
  var UserSchema = new brownie.VertexSchema({
    name: {
      type: String,
      key: 0
    },
    status: {
      type: brownie.Types.Short,
      init: 0
    }
  });

  var userModel = brownie.model('user', UserSchema);

  var RelationshipSchema = new brownie.EdgeSchema(
    [ userModel ],
    [ userModel ], 
    {
      category: {
        type: String
      }
    }
  );

  var relationshipModel = brownie.model('relationship', RelationshipSchema);

  brownie.initialize();
```

## Sample Usage

```js
  var gizmo = userModel({
    properties: {
      name: 'Gizmo',
      status: 1
    }
  });

  var billy = userModel({
    properties: {
      name: 'Billy'
    }
  });

  var relationship = relationshipModel({
    outV: gizmo,
    inV: billy,
    properties: {
      category: 'Friend'
    }
  });

  relationship.save();
```

```js
  var gizmo = userModel({
    properties: {
      name: 'Gizmo'
    }
  });

  gizmo.get()
  .then(function (graph) {
    var doc = graph.first();

    console.log(doc.value('status'));
  });
```

## Tests

Tests are performed on the local gremlin server. Use with caution on a test server. They provide a good overview of all functionalities.
```shell
  npm test
```

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests to cover it.