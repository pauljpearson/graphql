const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

const supergraphSdl = new IntrospectAndCompose({
  // This entire subgraph list is optional when running in managed federation
  // mode, using Apollo Studio as the source of truth.  In production,
  // using a single source of truth to compose a schema is recommended and
  // prevents composition failures at runtime using schema validation using
  // real usage-based metrics.
  subgraphs: [
    { name: 'accounts', url: 'http://accounts:4001/' },
    { name: 'reviews', url: 'http://reviews:4002/' },
    { name: 'products', url: 'http://products:4003/' },
    { name: 'inventory', url: 'http://inventory:4004/' },
  ],
});

const gateway = new ApolloGateway({
  supergraphSdl,
  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false,
});

(async () => {
  const server = new ApolloServer({
    gateway,

    // Apollo Graph Manager (previously known as Apollo Engine)
    // When enabled and an `ENGINE_API_KEY` is set in the environment,
    // provides metrics, schema management and trace reporting.
    engine: false,

    // Subscriptions are unsupported but planned for a future Gateway version.
    subscriptions: false,
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
