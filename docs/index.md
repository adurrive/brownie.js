Brownie.js
==========

Brownie is an object-to-graph mapper for Titan 1.0 with [Cassandra](http://cassandra.apache.org/) and [Elasticsearch](https://www.elastic.co/). It provides a schema-based solution to model application data as vertices and edges of a [TinkerPop](https://tinkerpop.apache.org/) graph. It handles data validation, type casting, schema declaration in Titan, query building, indexing, automatic retry on failure and more.

## Install

Make sure you have [Node.js](https://nodejs.org/) installed and a working gremlin server with [Titan](http://titan.thinkaurelius.com/). Install brownie from the command line using npm :
```js
  npm install brownie
```

Next manually copy script/brownie.groovy into the gremlin server's scripts folder. Edit gremlin-server.yaml and add the path to brownie.groovy to scriptEngines.gremlin-groovy.scripts. Restart the gremlin server.

## Getting started

First you need to open a connection to the gremlin server.
```js
  var brownie = require('brownie');

  var settings = {
    connection: {
      port: 8182,
      host: 'localhost'
    }
  };

  brownie.connect(settings)
  .then(function () {
    console.log('Connected to %s:%s', settings.connection.host, settings.connection.port);
  })
  .catch(function (err) {
    console.err(err);
  });
```

Vertices and edges models are derived from schemas. Let's take the [Graph of the Gods](http://s3.thinkaurelius.com/docs/titan/1.0.0/getting-started.html) example from the Titan documentation and declare three corresponding models.
```js
  var VertexSchema = brownie.VertexSchema;
  var EdgeSchema = brownie.EdgeSchema;
  var Types = brownie.Types;
  var Multiplicities = brownie.Multiplicities;

  var GodSchema = new VertexSchema({
    name: {
      type: String,
      key: 0
    },
    age: {
      type: Types.Integer
    },
    type: {
      type: String
    }
  });

  var godModel = brownie.model('god', GodSchema); // 'god' will be the vertex label in Titan

  var LocationSchema = new VertexSchema({
    name: {
      type: String,
      key: 0
    },
    type: {
      type: String
    }
  });

  var locationModel = brownie.model('location', GodSchema); // 'location' will be the vertex label in Titan

  var LivesSchema = new EdgeSchema(
    [ godModel ], // Allowed in vertex models
    [ locationModel ], // Allowed out vertex models
    {
      reason: {
        type: String
      }
    },
    {
      multiplicity: Multiplicities.MANY2ONE
    }
  );

  var livesModel = brownie.model('lives', LivesSchema); // 'lives' will be the edge label in Titan

  brownie.initialize()
  .then(function () {
    console.log('Models created in Titan');
  })
  .catch(function (err) {
    console.err(err);
  });
```

We can then create vertices and edges based on the available models. Note that an edge automatically includes its declared in and out vertices. It is therefore not necessary to save them separately.
```js
  var Graph = brownie.Graph;

  var graph = new Graph();

  var neptune = godModel({
    properties: {
      name: 'neptune',
      age: 4500,
      type: 'god'
    }
  });

  var sea = locationModel({
    properties: {
      name: 'sea',
      type: 'location'
    }
  });

  var lives = livesModel({
    outV: neptune,
    inV: sea,
    properties: {
      reason: 'loves waves'
    }
  });

  graph.add(lives);

  graph.save()
  .then(function () {
    console.log('Graph saved')
  })
  .catch(function (err) {
    console.err(err);
  });

  // Directly saving one vertex or one edge is also possible
  lives.save()
  .then(function () {
    console.log('Edge and both its vertices saved');
  })
  .catch(function (err) {
    console.err(err);
  });
```

To get vertices or edges, we can query by key properties or by executing a custom gremlin script. Results are always provided as a brownie graph object.
```js
  var Script = brownie.Script;
  var god;

  // Query by key property
  god = godModel({
    properties: {
      name: 'neptune'
    }
  });

  god.get()
  .then(function (graph) {
    console.log('Neptune is %s years old', graph.first().value('age'));
  });

  // Query by executing a custom gremlin script
  god = godModel({
    script: Script('g.V().has(org.apache.tinkerpop.gremlin.structure.T.label, \'god\').has(\'age\', org.apache.tinkerpop.gremlin.process.traversal.P.lte(bindings.maxAge)).limit(1)',  
    { maxAge: 5000 })
  });

  god.get()
  .then(function (graph) {
    console.log('%s is less than 5000 years old', graph.first().value('name'));
  })
  .catch(function (err) {
    console.err(err);
  });
```

## Settings

### settings.connection.port
Type: `Number`
Default value: `8182`

Port of the gremlin server.

### settings.connection.host
Type: `String`
Default value: `localhost`

Host of the gremlin server.

### settings.connection.reconnect
Type: `Number`
Default value: `10`

Number of times to retry on failure to connect to the gremlin server.

### settings.connection.reconnectInterval
Type: `Number`
Default value: `1000`

Interval to wait in ms before retrying to connect to the gremlin server.

### settings.connection.retryOnWebSocketError
Type: `Number`
Default value: `10`

Number of times to retry on WebSocketError failure.

### settings.connection.retryOnWebSocketErrorInterval
Type: `Number`
Default value: `5000`

Interval to wait in ms before retrying on WebSocketError failure.

### settings.connection.retryOnUniquenessError
Type: `Number`
Default value: `10`

Number of times to retry on UniquenessError failure.

### settings.connection.retryOnUniquenessErrorInterval
Type: `Number`
Default value: `200`

Interval to wait in ms before retrying on UniquenessError failure.

### settings.connection.retryOnError
Type: `Number`
Default value: `1`

Number of times to retry on Error failure.

### settings.connection.retryOnErrorInterval
Type: `Number`
Default value: `1000`

Interval to wait in ms before retrying on Error failure.

### settings.search.elementIdentifier
Type: `String`
Default value: `$vertex$`

Element identifier to use for direct queries in Elasticsearch. Change this if you already use this specific string in your query.

### settings.search.offset
Type: `Number`
Default value: `0`

Default offset to use for direct queries in Elasticsearch.

### settings.search.limit
Type: `Number`
Default value: `10`

Default limit to use for direct queries in Elasticsearch.

### settings.initialize
Type: `Boolean`
Default value: `false`

Automatically initialize all current models in Titan when connecting to the gremlin server. 

### settings.split
Type: `String`
Default value: `|`

Split separator used to combine all the key properties of a model into its unique indexed key @key. Change this if you may use this specific string in your key properties data. Note that you will not be able to change this afterwards.

### settings.trim
Type: `Boolean`
Default value: `true`

Automatically trim all values.

### settings.log
Type: `Number`
Default value: `1`

Use 0 for none, 1 for errors, 2 for information, 3 for debug and 4 for dump.

## API Docs

The API Docs are available [here](http://browniejs.readthedocs.io/).

## Tests

Tests are performed on the local gremlin server. Use with caution on a dedicated test server.
```shell
  npm test
```

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests to cover it.
