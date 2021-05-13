import { ApolloServer } from "apollo-server-lambda";
import { typeDefs, resolvers } from "./schema";
import { environment } from "./environment";

const apolloServer = new ApolloServer({
   typeDefs,
   resolvers,
   playground: {
      endpoint: `/${environment.providerStage}/graphql`
   },
   context: ({ event, context }) => {
      return {
         headers: event.headers,
         functionName: context.functionName,
         event,
         context
      };
   }
});

exports.graphqlHandler = apolloServer.createHandler({
   cors: {
      origin: true,
      credentials: true
   }
});
