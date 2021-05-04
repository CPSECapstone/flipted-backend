import { USER_PROGRESS_TABLE_NAME } from "../environment";
import dynamodb, { PutCompositeParams, ScanParams, QueryParams } from "../services/dynamodb";
import * as helper from "./progressHelper";
import { ProgressPK } from "./progressInterface";

export async function addProgress(input: ProgressInput) {
   const courseItem = helper.progressInputToDBItem(input);

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

export async function progressByUserAndCourse(
   userName: string,
   course: string
): Promise<Progress[]> {
   const params: QueryParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      keyConditionExpression: "PK = :pkVal",
      expressionAttributeValues: {
         ":pkVal": ProgressPK(userName, course)
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const progressList = helper.dbItemsToProgressList(output.Items);
         return progressList;
      }

      return [];
   } catch (err) {
      return err;
   }
}

export async function progressByCourse(course: string): Promise<Progress[]> {
   const params: ScanParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      filterExpression: "course = :courseVal",
      expressionAttributeValues: {
         ":courseVal": course
      }
   };

   try {
      const output = await dynamodb.scan(params);
      if (output.Items) {
         const progressList = helper.dbItemsToProgressList(output.Items);
         return progressList;
      }

      return [];
   } catch (err) {
      console.error(err);
      return err;
   }
}
