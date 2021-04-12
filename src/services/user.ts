import { unmarshall } from "@aws-sdk/util-dynamodb";

import dynamodb, { PutParams } from "./dynamodb";
import { User, UserInput } from "../interfaces";

const USER_TABLE = "flipted-Users-dev";

async function get(userId: string): Promise<User | null> {
  const params = {
    tableName: USER_TABLE,
    key: userId
  };

  const output = await dynamodb.get(params);
  if (output.Item) {
    return <User>unmarshall(output.Item);
  }
  return null;
}

const userService = {
  get
}

export default userService;
