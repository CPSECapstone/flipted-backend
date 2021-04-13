import { unmarshall } from "@aws-sdk/util-dynamodb";

import dynamodb from "./dynamodb";
import { User } from "../interfaces";
import { USERS_TABLE_NAME } from "../environment";

async function get(userId: string): Promise<User> {
  const params = {
    tableName: USERS_TABLE_NAME,
    key: userId
  };

  const output = await dynamodb.get(params);
  if (output.Item) {
    return <User>unmarshall(output.Item);
  }
  throw new Error(`username: ${userId} not found`);
}

/** 
 * Returns the role of the user given the user id contained in the JWT access token
 * Should be either "instructor" or "student"
 */
 async function getUserRole(userId: string) {
  return (await get(userId)).role; 
}

const userService = {
  get,
  getUserRole
}

export default userService;
