import { USER_PROGRESS_TABLE_NAME } from "../environment";
import dynamodb from "../services/dynamodb";
import {
   StudentObjectiveMasteryItem,
   StudentObjectiveMasteryPKPrefix,
   StudentObjectiveMasterySKPrefix
} from "./targetMasteryInterface";
import * as rosterService from "../roster/rosterService";
import * as helper from "./targetMasteryHelper";
import * as objectiveHelper from "../objective/objectiveHelper";
import * as targetService from "../target/targetService";
import * as objectiveService from "../objective/objectiveService";
import { ObjectiveItem } from "../objective/objectiveInterface";

export async function listStudentObjectiveMasteryItemByTarget(
   targetId: string
): Promise<StudentObjectiveMasteryItem[]> {
   const params: QueryParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      indexName: "targetId-index",
      keyConditionExpression: "targetId = :targetIdVal",
      expressionAttributeValues: {
         ":targetIdVal": targetId
      }
   };

   return dynamodb.queryList<StudentObjectiveMasteryItem>(params);
}

export async function queryClassTargetMastery(targetId: string): Promise<ClassTargetMastery> {
   try {
      const target: Target = await targetService.getTargetById(targetId);
      const objectiveItems: Array<ObjectiveItem> = await objectiveService.listObjectiveItemsByTarget(
         targetId
      );
      const objectives: Array<Objective> = objectiveItems.map(objectiveHelper.dbItemToObjective);

      const students: Array<Student> = await rosterService.listStudentsByCourse(target.course);
      const masteryItems: Array<StudentObjectiveMasteryItem> = await listStudentObjectiveMasteryItemByTarget(
         target.targetId
      );

      const classTargetMastery: ClassTargetMastery = helper.generateClassTargetMastery(
         target,
         objectives,
         students,
         masteryItems
      );
      return classTargetMastery;
   } catch (err) {
      return err;
   }
}

export async function importItems(masteryItems: StudentObjectiveMasteryItem[]): Promise<number> {
   masteryItems.forEach(item => {
      item.source = "imported";
   });

   const params: BatchWriteParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      items: masteryItems
   };

   try {
      return dynamodb.batchWrite(params);
   } catch (err) {
      return err;
   }
}

export async function deleteItems(): Promise<number> {
   const params: ScanParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      filterExpression: "begins_with(PK, :pkPrefix) and begins_with(SK, :skPrefix)",
      expressionAttributeValues: {
         ":pkPrefix": StudentObjectiveMasteryPKPrefix,
         ":skPrefix": StudentObjectiveMasterySKPrefix
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}
