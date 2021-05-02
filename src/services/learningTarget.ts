import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TABLE_NAME } from "../environment";
import { LearningTargetItem } from "../interfaces/learningTarget";
import dynamodb, { GetCompositeParams, PutCompositeParams, QueryParams } from "./dynamodb";
import * as helper from "./learningTargetHelper";

const LEARNING_TARGETS_TABLE = TABLE_NAME("CourseContent");

export async function addLearningTarget(input: LearningTargetInput) {
   const targetItem: LearningTargetItem = helper.learningTargetInputToDBItem(input);

   const params: PutCompositeParams = {
      tableName: LEARNING_TARGETS_TABLE,
      item: targetItem
   };

   try {
      const output = dynamodb.putComposite(params);
      return targetItem.PK;
   } catch (err) {
      return err;
   }
}

export async function getTargetById(targetId: string): Promise<LearningTarget> {
   const params: GetCompositeParams = {
      tableName: LEARNING_TARGETS_TABLE,
      key: {
         PK: `TARGET#${targetId}`,
         SK: `TARGET#${targetId}`
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const item = <LearningTargetItem>unmarshall(output.Item);
         const target = helper.dbItemToLearningTarget(item);
         return target;
      }

      throw new Error(`LearningTarget not found with targetId=${targetId}`);
   } catch (err) {
      return err;
   }
}

export async function listTargetsByCourse(course: string): Promise<LearningTarget[]> {
   const params: QueryParams = {
      tableName: LEARNING_TARGETS_TABLE,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :pkVal) ",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkVal": "TARGET"
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const targets = helper.dbItemsToLearningTargets(output.Items);
         return targets;
      }

      return [];
   } catch (err) {
      return err;
   }
}
