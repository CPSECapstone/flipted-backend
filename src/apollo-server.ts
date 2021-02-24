import { ApolloServer } from 'apollo-server-lambda';

import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

const apolloServer = new ApolloServer({ 
   resolvers, 
   typeDefs, 
   playground: {    endpoint: "/dev/graphql"  } 
});

exports.graphqlHandler = apolloServer.createHandler({
   cors: {
     origin: true,
     credentials: true,
   },
 });