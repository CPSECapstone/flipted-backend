import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandOutput,
  ScanCommand,
  ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";
import { Task, TaskInput } from "../interfaces";
import { uid } from "uid/secure";

const client = new DynamoDBClient({ region: "us-east-1" });
const TASK_TABLE = "Tasks-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function add(input: TaskInput) {
  const task = <Task>input;
  task.id = uid();

  const command: PutItemCommand = new PutItemCommand({
    TableName: TASK_TABLE,
    Item: marshall(task, marshallOpts),
    ReturnValues: "ALL_OLD",
  });

  try {
    const output: PutItemCommandOutput = await client.send(command);
    return task.id;
  } catch (err) {
    return err;
  }
}

async function getById(taskId: string): Promise<Task> {
  const command = new GetItemCommand({
    TableName: TASK_TABLE,
    Key: marshall({
      id: taskId
    }, marshallOpts)
  });

  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      const task = <Task>unmarshall(output.Item);
      return task;
    }

    throw new Error(`Mission not found with id=${taskId}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function listBySubMissionId(subMissionId: string): Promise<Task[]> {
  const command = new ScanCommand({
    TableName: TASK_TABLE,
    FilterExpression: 'subMissionId = :subMissionId',
    ExpressionAttributeValues: marshall({
      ":subMissionId": subMissionId
    }, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    if (output.Items) {
      const tasks = output.Items.map((item: any) => {
        return <Task>unmarshall(item);
      });
      return tasks;
    }

    return [];
  } catch (err) {
    console.error(err);
    return err;
  }
}

const taskService = {
  add,
  getById,
  listBySubMissionId
}

export default taskService;
