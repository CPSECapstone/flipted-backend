import { FliptedContext } from "../environment";
import userService from "../services/user";

const { validateToken } = require("../jws-verifer");

async function getUser(_: any, args: any, context: FliptedContext, info: any) {
   return await userService.get(context.username);
}

async function updateUser(_: any, args: any, context: FliptedContext, info: any) {
   return await userService.update(context.username, args.updateUserInput);
}

const resolvers = {
   Query: {
      getUser: getUser
   },
   Mutation: {
      updateUser: updateUser
   },
   Role: {
      STUDENT: "student",
      INSTRUCTOR: "instructor"
   }
};

export default resolvers;
