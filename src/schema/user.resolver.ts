import userService from '../services/user';

const { validateToken } = require("../jws-verifer");

async function getUser(_: any, args: any, context: any, info: any) {
  const token = await validateToken(context.headers.Authorization);
  return await userService.get(token.username);
}

async function updateUser(_: any, args: any, context: any, info: any) {
  const token = await validateToken(context.headers.Authorization);
  return await userService.update(token.username, args.userInput);
}

const resolvers = {
  Query: {
    getUser: getUser,
  },
  Mutation: {
    updateUser: updateUser
  },
  Role: {
    STUDENT: 'student',
    INSTRUCTOR: 'instructor'
  }
}

export default resolvers;
