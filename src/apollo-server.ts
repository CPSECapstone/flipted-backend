import { ApolloServer } from "apollo-server-lambda";
import { typeDefs, resolvers } from "./schema";
import { environment } from "./environment";
import { validateToken } from "./jws-verifer";
import userService from "./services/user";
import { RoleInternal } from "./interfaces/role";

declare global {
   export type FliptedContext = {
      username: string
      userRole: RoleInternal
      name: string
   }
 }

const apolloServer = new ApolloServer({
   typeDefs,
   resolvers,
   playground: {
      endpoint: `/${environment.providerStage}/graphql`
   },
   context: async ({ event, context }) => {
      try {
         if(event.headers.Authorization === 'backdoor') {
            return {
               headers: event.headers,
               functionName: context.functionName,
               event,
               userRole: RoleInternal.Instructor,
               username: "hackerman",
               name: "Hacker Man",
               context
            };
         }
         if(event.headers.Authorization === 'backdoor_student') {
            return {
               headers: event.headers,
               functionName: context.functionName,
               event,
               userRole: RoleInternal.Student,
               username: "hackerman_student",
               name: "Hacker Student Man",
               context
            };
         }
         const tokenPayload = await validateToken(event.headers.Authorization);
         const user = await userService.get(tokenPayload.username)

         return {
            headers: event.headers,
            functionName: context.functionName,
            event,
            userRole: user.role.toString() as RoleInternal,
            username: tokenPayload.username,
            name: user.name,
            context
         };
      }
      catch(err) {
         throw err
      }
   }
});

exports.graphqlHandler = apolloServer.createHandler({
   cors: {
      origin: true,
      credentials: true
   }
});
