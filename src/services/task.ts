import { unmarshall, } from "@aws-sdk/util-dynamodb";

import { environment } from "../environment";
import { Task, TaskInput } from "../interfaces";
import dynamodb, { GetParams, PutParams, ScanParams } from "./dynamodb";

const TASK_TABLE = "Tasks-" + environment.stage;

async function add(input: TaskInput) {
  const params: PutParams = {
    tableName: TASK_TABLE,
    item: input
  };

  return dynamodb.put(params);
}

async function getById(taskId: string): Promise<Task> {
  const params: GetParams = {
    tableName: TASK_TABLE,
    key: taskId
  };

  const output = await dynamodb.get(params);
  if (output.Item) {
    const task = <Task>unmarshall(output.Item);
    return task;
  }

  throw new Error(`Task not found with id=${taskId}`);
}

async function listBySubMissionId(subMissionId: string): Promise<Task[]> {
  const params: ScanParams = {
    tableName: TASK_TABLE,
    filterExpression: 'subMissionId = :subMissionId',
    expressionAttributeValues: {
      ":subMissionId": subMissionId
    }
  };

  const output = await dynamodb.scan(params);
  if (output.Items) {
    const tasks = output.Items.map((item: any) => {
      return <Task>unmarshall(item);
    });
    return tasks;
  }

  return [];
}

const taskService = {
  add,
  getById,
  listBySubMissionId
}

export default taskService;
