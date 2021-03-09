const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { environment } = require("./environment");
const client = new DynamoDBClient({ region: "us-east-1" });
import { TaskInput } from './interfaces';
import { uid } from 'uid/secure';

export class TaskResolvers {
  getTasks = async () => {
    const params = {
      TableName: "Tasks-" + environment.stage,
    };
  
    try {
      const results = await client.send(new ScanCommand(params));
      const tasks: any[] = [];
      results.Items.forEach((item : any) => {
        tasks.push(unmarshall(item));
      });
      return tasks;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  addTask = async (args: any) => {
   const task: TaskInput = args.task;
   const params = {
      TableName: "Tasks-" + environment.stage,
      Item: {
         "id": {
            S: uid()
         },
         "name": {
            S: task.name
         },
         "description": {
            S: task.description
         },
         "link": {
            S: task.link
         }
      }
   }

   try {
      await client.send(new PutItemCommand(params));
      return unmarshall(params.Item);
   } catch (err) {
      console.log(err);
      return err;
   }
  }
}