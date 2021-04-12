import userService from '../services/user';

const { validateToken } = require("../jws-verifer");

async function getUser(_: any, args: any, context: any, info: any) {
  const token = await validateToken(context.headers.Authorization);
  return await userService.get(token.username);;
}

const resolvers = {
  Query: {
    getUser: getUser
  }
}

export default resolvers;
