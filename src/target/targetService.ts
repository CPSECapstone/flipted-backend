import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import { TargetItem, TargetKey, TargetPrefix } from "./targetInterface";
import dynamodb, {
   GetCompositeParams,
   PutCompositeParams,
   QueryParams
} from "../services/dynamodb";
import * as helper from "./targetHelper";

export async function addTarget(input: TargetInput) {
   const targetItem: TargetItem = helper.targetInputToDBItem(input);

   const params: PutCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      item: targetItem
   };

   try {
      const output = dynamodb.putComposite(params);
      return targetItem.PK;
   } catch (err) {
      return err;
   }
}

export async function getTargetById(targetId: string): Promise<Target> {
   const params: GetCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: TargetKey(targetId),
         SK: TargetKey(targetId)
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const item = <TargetItem>unmarshall(output.Item);
         const target = helper.dbItemToTarget(item);
         return target;
      }

      throw new Error(`Target not found with targetId=${targetId}`);
   } catch (err) {
      return err;
   }
}

// query GSI. partition key - course, sort key - PK
export async function listTargetsByCourse(course: string): Promise<Target[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :skPrefix)",
      expressionAttributeValues: {
         ":courseVal": course,
         ":skPrefix": TargetPrefix
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const targets = helper.dbItemsToTargets(output.Items);
         return targets;
      }

      return [];
   } catch (err) {
      return err;
   }
}
