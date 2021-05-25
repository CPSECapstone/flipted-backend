import { ApolloServer } from "apollo-server-lambda";
import { typeDefs, resolvers } from "./schema";
import { environment } from "./environment";
import { validateToken } from "./jws-verifer";
import userService from "./services/user";
import { RoleInternal } from "./interfaces/role";

declare global {
   export type FliptedContext = {
      username: string;
      userRole: RoleInternal;
   };
}

const apolloServer = new ApolloServer({
   typeDefs,
   resolvers,
   playground: {
      endpoint: `/${environment.providerStage}/graphql`
   },
   context: async ({ event, context }) => {
      try {
         const tokenPayload = await validateToken(event.headers.Authorization);
         const userRole = await userService.getUserRole(tokenPayload.username);

         return {
            headers: event.headers,
            functionName: context.functionName,
            event,
            userRole: userRole,
            username: tokenPayload.username,
            context
         };
      } catch (err) {
         throw err;
      }
   }
});

exports.graphqlHandler = apolloServer.createHandler({
   cors: {
      origin: true,
      credentials: true
   }
});
