import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TABLE_NAME } from "../environment";
import {
   ObjectiveItem,
   ObjectivePK,
   ObjectiveSK,
   ObjectiveSKPrefix
} from "../interfaces/objective";
import dynamodb, { GetCompositeParams, PutCompositeParams, QueryParams } from "./dynamodb";
import * as helper from "./objectiveHelper";

const OBJECTIVES_TABLE = TABLE_NAME("CourseContent");

export async function addObjective(input: ObjectiveInput) {
   const objectiveItem = helper.objectiveInputToDBItem(input);

   const params: PutCompositeParams = {
      tableName: OBJECTIVES_TABLE,
      item: objectiveItem
   };

   try {
      const output = dynamodb.putComposite(params);
      return objectiveItem.SK;
   } catch (err) {
      return err;
   }
}

export async function getObjective(courseName: string, objectiveName: string): Promise<Objective> {
   const params: GetCompositeParams = {
      tableName: OBJECTIVES_TABLE,
      key: {
         PK: ObjectivePK(courseName),
         SK: ObjectiveSK(objectiveName)
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const item = <ObjectiveItem>unmarshall(output.Item);
         const objective = helper.dbItemToObjective(item);
         return objective;
      }

      throw new Error(
         `Objective not found with courseName=${courseName}, objectiveName=${objectiveName}`
      );
   } catch (err) {
      return err;
   }
}

export async function listObjectivesByCourse(courseName: string): Promise<Objective[]> {
   const params: QueryParams = {
      tableName: OBJECTIVES_TABLE,
      keyConditionExpression: "PK = :pkVal and begins_with(SK, :skPrefix) ",
      expressionAttributeValues: {
         ":pkVal": ObjectivePK(courseName),
         ":skPrefix": ObjectiveSKPrefix
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
