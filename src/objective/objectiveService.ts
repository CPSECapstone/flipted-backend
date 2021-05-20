import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import { ObjectiveItem, ObjectiveKey, ObjectivePrefix } from "./objectiveInterface";
import dynamodb, {
   BatchWriteParams,
   GetCompositeParams,
   QueryParams,
   ScanParams
} from "../services/dynamodb";
import * as helper from "./objectiveHelper";

export async function addObjective(input: ObjectiveInput) {
   const objectiveItem = helper.objectiveInputToDBItem(input);

   const items = input.taskIds.map(taskId => {
      return helper.objectTaskRecordItem(objectiveItem.objectiveId, taskId);
   });

   items.push(objectiveItem);

   const params: BatchWriteParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      items: items
   };
   try {
      const output = await dynamodb.batchWrite(params);
      return objectiveItem.PK;
   } catch (err) {
      return err;
   }
}

export async function getObjectiveById(objectiveId: string): Promise<Objective> {
   const params: GetCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: ObjectiveKey(objectiveId),
         SK: ObjectiveKey(objectiveId)
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const item = <ObjectiveItem>unmarshall(output.Item);
         const objective = helper.dbItemToObjective(item);
         return objective;
      }

      throw new Error(`Objective not found with objectiveId=${objectiveId}`);
   } catch (err) {
      return err;
   }
}

export async function listObjectivesByCourse(course: string): Promise<Objective[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :pkPrefix) ",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkPrefix": ObjectivePrefix
      }
   };

   const objectiveItems = await dynamodb.queryList<ObjectiveItem>(params);
   return objectiveItems.map(helper.dbItemToObjective);
}

export async function getObjective(parent: any) {
   return getObjectiveById(parent.objectiveId);
}

export async function listObjectiveItemsByCourse(course: string): Promise<ObjectiveItem[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :pkPrefix) ",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkPrefix": ObjectivePrefix
      }
   };

   return dynamodb.queryList<ObjectiveItem>(params);
}

export async function listObjectiveItemsByTarget(targetId: string): Promise<ObjectiveItem[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "targetId-SK-index",
      keyConditionExpression: "targetId = :targetIdVal and begins_with(SK, :skPrefix) ",
      expressionAttributeValues: {
         ":targetIdVal": targetId,
         ":skPrefix": ObjectivePrefix
      }
   };

   return dynamodb.queryList<ObjectiveItem>(params);
}

export async function importObjectives(objectiveItems: ObjectiveItem[]): Promise<number> {
   const objItems = objectiveItems;
   objItems.forEach(item => {
      item.source = "imported";
   });

   // a flat list of objective task record items for every objective
   const taskRecords = objItems
      .map(obj => {
         // a list of objective task record items for one objective
         return obj.taskIds.map(taskId => {
            // a single objective task record item
            return helper.objectTaskRecordItem(obj.objectiveId, taskId);
         });
      })
      .flat();

   // combine into one big batch
   const items = objItems as any[];
   items.push(...taskRecords);
   console.table(items);

   const params: BatchWriteParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      items
   };

   try {
      return dynamodb.batchWrite(params);
   } catch (err) {
      return err;
   }
}

export async function deleteObjectives(): Promise<number> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "begins_with(PK, :pkPrefix)",
      expressionAttributeValues: {
         ":pkPrefix": ObjectivePrefix
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}
