import { unmarshall } from "@aws-sdk/util-dynamodb";
import taskBusLogic, { dbItemsToTaskItem } from "./taskBusLogic";

import { TABLE_NAME } from "../environment";
import { TaskInput, TaskItem, Task, TaskProgress, TaskProgressItem } from "../interfaces/taskInterfaces";
import dynamodb, {
   GetCompositeParams,
   PutCompositeParams,
   QueryParams,
   ScanParams
} from "./dynamodb";

const TASKS_TABLE = TABLE_NAME("QuizBlocks");
const TASKS_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");

async function add(input: TaskInput) {
   const toSubmit: TaskItem = taskBusLogic.convertTaskInputToTaskItem(input);

   const params: PutCompositeParams = {
      tableName: TASKS_TABLE,
      item: toSubmit
   };

   try {
      const output = dynamodb.putComposite(params);
      return toSubmit.id;
   } catch (err) {
      return err;
   }
}

async function getTaskById(taskId: string): Promise<Task> {
   const params: QueryParams = {
      tableName: TASKS_TABLE,
      keyConditionExpression: "PK = :pkVal",
      expressionAttributeValues: {
         ":pkVal": `TASK#${taskId}`
      }
   };

   try {
      const output = await dynamodb.query(params);
      const task = await dbItemsToTaskItem(output.Items);
      if (!task) {
         throw new Error(`Task not found with id=${taskId}`);
      }

      return task;
   } catch (err) {
      return err;
   }
}

async function listBySubMissionId(subMissionId: string): Promise<Task[]> {
   const params: ScanParams = {
      tableName: TASKS_TABLE,
      filterExpression: "subMissionId = :subMissionId",
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

async function getTaskProgress(taskId: string, username: string): Promise<TaskProgress> {
   const params: GetCompositeParams = {
      tableName: TASKS_SUBMISSIONS_TABLE,
      key: {
         username: username,
         taskId: taskId
      }
   };

   const output = await dynamodb.getComposite(params);
   if (output.Item) {
      const taskProgress = <TaskProgress>unmarshall(output.Item);
      return taskProgress;
   }

   throw new Error(`Task not found with id=${taskId}`);
}

const taskService = {
   add,
   getTaskById,
   listBySubMissionId,
   getTaskProgress
};

export default taskService;
