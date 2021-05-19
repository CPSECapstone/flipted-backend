import { unmarshall } from "@aws-sdk/util-dynamodb";
import { MASTERY_TABLE, USER_PROGRESS_TABLE_NAME } from "../environment";
import dynamodb, {
   PutCompositeParams,
   ScanParams,
   QueryParams,
   BatchWriteParams
} from "../services/dynamodb";
import * as missionService from "../mission/missionService";
import * as rosterService from "../roster/rosterService";
import * as helper from "./missionMasteryHelper";
import {
   StudentMissionMasteryItem,
   StudentMissionMasteryPK,
   StudentMissionMasteryPKPrefix,
   StudentMissionMasterySKPrefix
} from "./missionMasteryInterface";
import taskService from "../services/task";

export async function addMissionMastery(input: StudentMissionMasteryInput): Promise<string> {
   const courseItem = helper.missionMasteryInputToDBItem(input);

   const params: PutCompositeParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      item: courseItem
   };

   try {
      const output = dynamodb.putComposite(params);
      return courseItem.SK;
   } catch (err) {
      return err;
   }
}

export async function listMissionMastery(missionId: string): Promise<StudentMissionMasteryItem[]> {
   const params: QueryParams = {
      tableName: MASTERY_TABLE,
      keyConditionExpression: "PK = :pkVal",
      expressionAttributeValues: {
         ":pkVal": StudentMissionMasteryPK(missionId)
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const masteryList = output.Items.map(rawItem => {
            const item = unmarshall(rawItem);
            return <StudentMissionMasteryItem>item;
         });
         return masteryList;
      }

      return [];
   } catch (err) {
      return err;
   }
}

export async function queryClassMissionMastery(
   courseId: string,
   missioId: string
): Promise<ClassMissionMastery> {
   try {
      const students: Student[] = await rosterService.listStudentsByCourse(courseId);
      const mission: Mission = await missionService.getMissionById(missioId);
      const tasks: Task[] = await taskService.listTasksByMissionId(missioId);
      const mastertyItems: StudentMissionMasteryItem[] = await listMissionMastery(missioId);
      const classMissionMastery = helper.generateClassMissionMastery(
         students,
         mission,
         tasks,
         mastertyItems
      );
      return classMissionMastery;
   } catch (err) {
      return err;
   }
}

export async function importItems(masteryItems: StudentMissionMasteryItem[]): Promise<number> {
   masteryItems.forEach(item => {
      item.source = "imported";
   });

   const params: BatchWriteParams = {
      tableName: MASTERY_TABLE,
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
      tableName: MASTERY_TABLE,
      filterExpression: "begins_with(PK, :pkPrefix) and begins_with(SK, :skPrefix)",
      expressionAttributeValues: {
         ":pkPrefix": StudentMissionMasteryPKPrefix,
         ":skPrefix": StudentMissionMasterySKPrefix
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}
