import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import { TaskInfoItem, TaskInfoKey, TaskInfoPrefix } from "../interfaces/taskInfo";
import dynamodb, { GetCompositeParams, PutCompositeParams, QueryParams } from "./dynamodb";
import * as helper from "./taskInfoHelper";

export async function addTaskInfo(input: TaskInfoInput) {
   try {
      const taskInfoItem = helper.taskInfoInputToDBItem(input);

      const params: PutCompositeParams = {
         tableName: COURSE_CONTENT_TABLE_NAME,
         item: taskInfoItem
      };

      const output = dynamodb.putComposite(params);
      return taskInfoItem.PK;
   } catch (err) {
      return err;
   }
}

export async function getTaskInfoById(taskInfoId: string): Promise<TaskInfo> {
   const params: GetCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: TaskInfoKey(taskInfoId),
         SK: TaskInfoKey(taskInfoId)
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const item = <TaskInfoItem>unmarshall(output.Item);
         const taskInfo = helper.dbItemToTaskInfo(item);
         return taskInfo;
      }

      throw new Error(`TaskInfo not found with taskInfoId=${taskInfoId}`);
   } catch (err) {
      return err;
   }
}

export async function listTaskInfosByCourse(course: string): Promise<TaskInfo[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :pkPrefix) ",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkPrefix": TaskInfoPrefix
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const taskInfos = helper.dbItemsToTaskInfos(output.Items);
         return taskInfos;
      }

      return [];
   } catch (err) {
      return err;
   }
}
