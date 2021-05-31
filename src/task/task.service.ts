import { unmarshall } from "@aws-sdk/util-dynamodb";
import taskBusLogic, {
   dbItemsToTaskItem as dbItemsToTaskPages,
   dbItemToTask,
   batchResponseToTasks
} from "./taskBusLogic";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import { TaskItem, TaskKey, TaskPrefix } from "../interfaces/task";
import dynamodb from "../services/dynamodb";

async function add(input: TaskInput) {
   const toSubmit: TaskItem = taskBusLogic.convertTaskInputToTaskItem(input);

   const params: PutCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      item: toSubmit
   };

   try {
      const output = dynamodb.putComposite(params);
      return toSubmit.id;
   } catch (err) {
      return err;
   }
}

/**
 * 
 * @param taskId The id for the task pages to retrieve
 * @returns Each page along with its blcok data
 */
async function getTaskPagesById(taskId: string): Promise<Page[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      keyConditionExpression: "PK = :pkVal",
      expressionAttributeValues: {
         ":pkVal": `TASK#${taskId}`
      }
   };

   try {
      const output = await dynamodb.query(params);
      const taskPages = await dbItemsToTaskPages(output.Items);
      if (!taskPages) {
         throw new Error(`Task not found with id=${taskId}`);
      }

      return taskPages;
   } catch (err) {
      return err;
   }
}

async function listBySubMissionId(subMissionId: string): Promise<Task[]> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
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

async function getFullTaskById(taskId: string) : Promise<Task> {
   const taskData = getTaskInfoById(taskId)
   const pages = getTaskPagesById(taskId)

   return {
      ... await taskData,
      pages: await pages
   }
}

// simplified version of task, not including pages nor blocks
async function getTaskInfoById(taskId: string): Promise<Task> {
   const params: GetCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: `TASK#${taskId}`,
         SK: `TASK#${taskId}`
      }
   };

   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const task = dbItemToTask(output.Item);
         return task;
      }

      throw new Error(`Task not found with id=${taskId}`);
   } catch (err) {
      return err;
   }
}

// simplified version of task, not including pages nor blocks
async function listTasksByCourse(course: string): Promise<Task[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :pkPrefix)",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkPrefix": "TASK#"
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const tasks = output.Items.map(rawItem => {
            return dbItemToTask(rawItem);
         });
         return tasks;
      }

      return [];
   } catch (err) {
      return err;
   }
}

async function listTasksByIds(taskIds: string[]): Promise<Task[]> {
   const tableName = COURSE_CONTENT_TABLE_NAME;
   const keys = taskIds.map(taskId => {
      return {
         PK: TaskKey(taskId),
         SK: TaskKey(taskId)
      };
   });
   const params: BatchGetParams = {
      tableName,
      keys
   };

   try {
      const output = await dynamodb.batchGet(params);
      if (output.Responses) {
         const tasks = batchResponseToTasks(output.Responses[tableName]);
         return tasks;
      }

      return [];
   } catch (err) {
      return err;
   }
}

async function listTasksByMissionId(missionId: string): Promise<Task[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "missionId-index",
      keyConditionExpression: "missionId = :missionIdVal",
      filterExpression: "begins_with(SK, :skPrefix)",
      expressionAttributeValues: {
         ":missionIdVal": missionId,
         ":skPrefix": TaskPrefix
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const tasks = output.Items.map(rawItem => {
            return dbItemToTask(rawItem);
         });
         return tasks;
      }

      return [];
   } catch (err) {
      console.log(err);
      return err;
   }
}

async function importTasks(taskItems: TaskItem[]): Promise<number> {
   taskItems.forEach(taskItem => {
      taskItem.source = "imported";
   });

   const params: BatchWriteParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      items: taskItems
   };

   try {
      return dynamodb.batchWrite(params);
   } catch (err) {
      return err;
   }
}

async function deleteTasks(): Promise<number> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "begins_with(PK, :pkPrefix)",
      expressionAttributeValues: {
         ":pkPrefix": "TASK"
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}

const taskService = {
   add,
   getTaskPagesById,
   listBySubMissionId,
   getTaskInfoById,
   listTasksByCourse,
   listTasksByMissionId,
   listTasksByIds,
   importTasks,
   deleteTasks,
   getFullTaskById
};

export default taskService;
