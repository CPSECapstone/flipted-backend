import { environment } from './environment';
import { getUsers } from './users-resolver';

//TOP LEVEL FILE FOR ALL QUERY RESOLVERS

//SEE USERS RESOLVER FOR LOGIC
export const resolvers = {
  Query: {
    users: () => getUsers()
  },
};