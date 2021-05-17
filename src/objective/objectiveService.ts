import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import { ObjectiveItem, ObjectiveKey, ObjectivePrefix } from "./objectiveInterface";
import dynamodb, {
   BatchWriteParams,
   GetCompositeParams,
   PutCompositeParams,
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
      if (output.ConsumedCapacity) {
         console.log(output.ConsumedCapacity);
         return output.ConsumedCapacity.length;
      }

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

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const objectives = helper.dbItemsToObjectives(output.Items);
         return objectives;
      }

      return [];
   } catch (err) {
      return err;
   }
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

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         return output.Items.map(rawItem => {
            return <ObjectiveItem>unmarshall(rawItem);
         });
      }

      return [];
   } catch (err) {
      return err;
   }
}

export async function batchWriteObjectives(objectives: ObjectiveInput[]): Promise<number> {
   const objItems = objectives.map(helper.objectiveInputToDBItem);

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

   const params: BatchWriteParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      items
   };
   try {
      const output = await dynamodb.batchWrite(params);

      if (output.ConsumedCapacity) {
         console.log(output.ConsumedCapacity);
         return output.ConsumedCapacity.length;
      }

      return 0;
   } catch (err) {
      return err;
   }
}

export async function deleteObjectives(): Promise<number> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "begins_with(PK, :pkPrefix) and begins_with(SK, :skPrefix)",
      expressionAttributeValues: {
         ":pkPrefix": ObjectivePrefix,
         ":skPrefix": ObjectivePrefix
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}
