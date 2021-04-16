import { unmarshall, } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import taskBusLogic from "./taskBusLogic";

import { TABLE_NAME } from "../environment";
import { PageInput, Page, TaskBlockInput, TaskInput, Task, TaskProgress } from "../interfaces/taskInterfaces";
import dynamodb, { GetCompositeParams, GetParams, PutCompositeParams, PutParams, ScanParams } from "./dynamodb";

const TASKS_TABLE = TABLE_NAME("Tasks");
const TASKS_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions")
const TASK_SUBMISSION_PREFIX = "TASK_SUBMISSION_"
const TASK_PROGRESS_PREFIX = "TASK_PROGRESS_"

async function add(input: TaskInput) {
   
   const toSubmit: Task = taskBusLogic.convertTaskInputToTask(input)
   
   const params: PutParams = {
    tableName: TASKS_TABLE,
    item: toSubmit
  };

  return dynamodb.put(params);
}

async function getTaskById(taskId: string): Promise<Task> {
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

async function getTaskProgress(taskId: string, username: string) : Promise<TaskProgress> {
   const params: GetCompositeParams = {
      tableName: TASKS_SUBMISSIONS_TABLE,
      key: {
         username: TASK_PROGRESS_PREFIX + username,
         taskId: taskId,
       },
    };
  
    const output = await dynamodb.getComposite(params);
    if (output.Item) {
      const taskProgress = <TaskProgress>unmarshall(output.Item);
      return taskProgress;
    }
  
    throw new Error(`Task Progress not found with id=${taskId}`);
}

async function updateTaskProgress(taskProgress: TaskProgress)
{
   const params: PutCompositeParams = {
      tableName: TASKS_SUBMISSIONS_TABLE,
      item: {
         username: TASK_PROGRESS_PREFIX + taskProgress.username,
         taskId: taskProgress.taskId,
         finishedRequirementIds: taskProgress.finishedRequirementIds
      }
   }
   return dynamodb.putComposite(params)
}

async function getTaskSubmission(taskId: string, username: string) {
   const params: GetCompositeParams = {
      tableName: TASKS_SUBMISSIONS_TABLE,
      key: {
         username:  TASK_SUBMISSION_PREFIX + username,
         taskId: taskId
      }
   }

   return dynamodb.getComposite(params)
}

async function createTaskSubmission(taskId: string, username: string) {
   const params: PutCompositeParams = {
      tableName: TASKS_SUBMISSIONS_TABLE,
      item: {
         username: TASK_SUBMISSION_PREFIX + username,
         taskId: taskId
      }
   }
   return dynamodb.putComposite(params)
}

const taskService = {
  add,
  getTaskById,
  listBySubMissionId,
  updateTaskProgress,
  getTaskProgress,
  getTaskSubmission,
  createTaskSubmission
}

export default taskService;