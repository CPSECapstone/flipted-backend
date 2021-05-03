import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TABLE_NAME } from "../environment";
import { TargetItem, TargetPK, TargetSK, TargetSKPrefix } from "../interfaces/target";
import dynamodb, { GetCompositeParams, PutCompositeParams, QueryParams } from "./dynamodb";
import * as helper from "./targetHelper";

const TARGETS_TABLE = TABLE_NAME("CourseContent");

export async function addTarget(input: TargetInput) {
   const targetItem: TargetItem = helper.targetInputToDBItem(input);

   const params: PutCompositeParams = {
      tableName: TARGETS_TABLE,
      item: targetItem
   };

   try {
      const output = dynamodb.putComposite(params);
      return targetItem.SK;
   } catch (err) {
      return err;
   }
}

export async function getTarget(course: string, targetId: string): Promise<Target> {
   const params: GetCompositeParams = {
      tableName: TARGETS_TABLE,
      key: {
         PK: TargetPK(course),
         SK: TargetSK(targetId)
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

export async function listTargetsByCourse(course: string): Promise<Target[]> {
   const params: QueryParams = {
      tableName: TARGETS_TABLE,
      keyConditionExpression: "PK = :pkVal and begins_with(SK, :skPrefix) ",
      expressionAttributeValues: {
         ":pkVal": TargetPK(course),
         ":skPrefix": TargetSKPrefix
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
