import { unmarshall, } from "@aws-sdk/util-dynamodb";

import { TABLE_NAME } from "../environment";
import { Task, TaskInput } from "../interfaces";
import dynamodb, { GetParams, PutParams, ScanParams } from "./dynamodb";

const TASKS_TABLE = TABLE_NAME("Tasks");

async function add(input: TaskInput) {
  const params: PutParams = {
    tableName: TASKS_TABLE,
    item: input
  };

  return dynamodb.put(params);
}

async function getById(taskId: string): Promise<Task> {
  const params: GetParams = {
    tableName: TASKS_TABLE,
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
    tableName: TASKS_TABLE,
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
