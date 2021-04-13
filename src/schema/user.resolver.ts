import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";

const client = new DynamoDBClient({ region: "us-east-1" });
const USER_TABLE = "Users-" + environment.stage;

const resolvers = {
  Query: {
    getUsers: async () => {
      const command = new ScanCommand({ TableName: USER_TABLE });
      try {
        const results = await client.send(command);
        const users: any[] = [];
        if (results.Items) {
          results.Items.forEach((item: any) => {
            users.push(unmarshall(item));
          });
        }
        return users;
      } catch (err) {
        console.error(err);
        return err;
      }
    }
  }, Mutation: {
    addUser: async () => {
      // todo
    }
  }
}

export default resolvers;
