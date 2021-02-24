import { gql } from 'apollo-server-lambda';

//THIS IS AN EXAMPLE. REMOVE/ADD TYPES AS YOU SEE FIT
export const typeDefs = gql`
  type Query {
    """
    List of users.
    """
    users: [User]
  }
  
  type User {
    """
    Flipted User Example
    """
    id: String!
    firstName: String!
    lastName: String!
  }
`
//END OF EXAMPLE.