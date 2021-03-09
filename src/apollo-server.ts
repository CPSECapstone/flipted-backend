import { ApolloServer } from 'apollo-server-lambda';
import { typeDefs, resolvers } from './schema';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: { endpoint: "/dev/graphql" }
});

exports.graphqlHandler = apolloServer.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
