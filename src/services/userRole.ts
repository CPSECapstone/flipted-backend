import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemInput,
  PutItemCommandInput,
  PutItemCommandOutput
} from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";

const client = new DynamoDBClient({ region: "us-east-1" });
const USER_TABLE = "Users-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

/** 
 * Returns the role of the user given the user id contained in the JWT access token
 * Should be either "instructor" or "student"
 */
async function getUserRole(username: string) {
  const command = new GetItemCommand({
    TableName: USER_TABLE,
    Key: marshall({
      id: username
    }, marshallOpts)
  });
  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      return unmarshall(output.Item).userRole;
    }
    throw new Error(`username: ${username} not found`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

const userTypeService = {
  getUserRole,
}

export default userTypeService;
