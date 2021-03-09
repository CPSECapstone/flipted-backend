import { unmarshall } from "@aws-sdk/util-dynamodb";
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
      const command = new PutItemCommand({
        TableName: TASK_TABLE,
        Item: {
          "id": { S: uid() },
          "name": { S: task.name.toString() },
          "description": { S: task.description.toString() },
          "link": { S: task.link.toString() }
        },
        ReturnValues: "ALL_OLD",
      });

      try {
        const results = await client.send(command);
        return {
          name: task.name.toString(),
          description: task.description.toString(),
          link: task.link.toString()
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  }
}

export default resolvers;
