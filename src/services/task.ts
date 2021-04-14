import { unmarshall, } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";

import { TABLE_NAME } from "../environment";
import { PageInput, Page, TaskBlockInput, TaskInput, Task, TaskProgress } from "../interfaces/taskInterfaces";
import dynamodb, { GetCompositeParams, GetParams, PutCompositeParams, PutParams, ScanParams } from "./dynamodb";

const TASKS_TABLE = TABLE_NAME("Tasks");
const TASKS_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions")

function convertPageInput(pageInput: PageInput) : Page
{
      return {
         skippable: pageInput.skippable,
         blocks: pageInput.blocks.map((blockInput: TaskBlockInput) => {
            return convertTaskBlockInput(blockInput)
         }),
      }
}

function convertTaskBlockInput(blockInput: TaskBlockInput) : any
{
   var specificBlock

   switch (blockInput.type)
   {
      case "TEXT":
         specificBlock = {
            contents: blockInput.textBlockInput.contents,
            fontSize: blockInput.textBlockInput.fontSize
         }
         break;
      case "IMAGE":
         specificBlock = {
            imageUrl: blockInput.imageBlockInput.imageUrl
         }
         break;
      case "VIDEO":
         specificBlock = {
            videoUrl: blockInput.videoBlockInput.videoUrl
         }
         break;
      default:
         throw new Error("TaskBlockInput enum handling error")
   }
   return {
      title: blockInput.title,
      requirement: {
         id: uid(),
         ...blockInput.requirement
      },
      ...specificBlock
   }
}

async function add(input: TaskInput) {
   const toSubmit = {
      name: input.name,
      instructions: input.instructions,
      points: input.points,
      startAt: input.startAt,
      endAt: input.endAt,
      dueDate: input.dueDate,
      subMissionId: input.subMissionId,
      objectiveId: input.objectiveId,
      pages: input.pages.map((element: any) => {
         return convertPageInput(element)
      }),
   }
   
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
         username: username,
         taskId: taskId,
       },
    };
  
    const output = await dynamodb.getComposite(params);
    if (output.Item) {
      const taskProgress = <TaskProgress>unmarshall(output.Item);
      return taskProgress;
    }
  
    throw new Error(`Task not found with id=${taskId}`);
}

async function updateTaskProgress(taskProgress: TaskProgress)
{
   const params: PutCompositeParams = {
      tableName: TASKS_SUBMISSIONS_TABLE,
      item: taskProgress
   }
   return dynamodb.putComposite(params)
}

const taskService = {
  add,
  getTaskById,
  listBySubMissionId,
  updateTaskProgress,
  getTaskProgress
}

export default taskService;