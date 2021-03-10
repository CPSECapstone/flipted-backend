import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { uid } from 'uid/secure';
import { environment } from "../environment";
import { TaskInput } from '../interfaces';

const client = new DynamoDBClient({ region: "us-east-1" });
const TASK_TABLE = "Tasks-" + environment.stage;

const resolvers = {
  Query: {
    getTasks: async () => {
      const command = new ScanCommand({ TableName: TASK_TABLE });
      try {
        const results = await client.send(command);
        const tasks: any[] = [];
        if (results.Items) {
          results.Items.forEach((item: any) => {
            tasks.push(unmarshall(item));
          });
        }
        return tasks;
      } catch (err) {
        console.error(err);
        return err;
      }
    }
  },
  Mutation: {
    addTask: async (_: any, args: any, context: any, info: any) => {
      const task: TaskInput = args.task;
      const params = {
        TableName: TASK_TABLE,
        Item: marshall({
          "id": uid(),
          "name": task.name,
          "description": task.description,
          "link": task.link
        }),
        ReturnValues: "ALL_OLD",
      }
      const command = new PutItemCommand(params);

      try {
        await client.send(command);
        return unmarshall(params.Item);
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  }
}

export default resolvers;
