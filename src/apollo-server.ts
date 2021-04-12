import { ApolloServer } from 'apollo-server-lambda';
import { typeDefs, resolvers } from './schema';

const { validateToken } = require("./jws-verifer");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: "/dev/graphql"
  },
  context: ({ event, context }) => {

   const token = validateToken(event.headers.Authorization)

   return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context
    };
  },
});

exports.graphqlHandler = apolloServer.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
