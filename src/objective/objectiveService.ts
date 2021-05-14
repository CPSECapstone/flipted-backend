import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import { ObjectiveItem, ObjectiveKey, ObjectivePrefix } from "./objectiveInterface";
import dynamodb, {
   GetCompositeParams,
   PutCompositeParams,
   QueryParams
} from "../services/dynamodb";
import * as helper from "./objectiveHelper";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

export async function addObjective(input: ObjectiveInput) {
   try {
      const objectiveItem = helper.objectiveInputToDBItem(input);

      const params: PutCompositeParams = {
         tableName: COURSE_CONTENT_TABLE_NAME,
         item: objectiveItem
      };

      const output = await dynamodb.putComposite(params);
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
