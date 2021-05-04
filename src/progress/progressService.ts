import { USER_PROGRESS_TABLE_NAME } from "../environment";
import dynamodb, { PutCompositeParams, ScanParams, QueryParams } from "../services/dynamodb";
import * as helper from "./progressHelper";
import { ProgressItem, ProgressPK } from "./progressInterface";
import * as courseService from "../services/course";
import usersData from "./users.json";
import { unmarshall } from "@aws-sdk/util-dynamodb";

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

export async function userProgress(userName: string, course: string): Promise<UserProgress> {
   const params: QueryParams = {
      tableName: USER_PROGRESS_TABLE_NAME,
      keyConditionExpression: "PK = :pkVal",
      expressionAttributeValues: {
         ":pkVal": ProgressPK(userName, course)
      }
   };

   try {
      const output = await dynamodb.query(params);
      const userProgress = helper.dbItemsToUserProgress(userName, output.Items || []);
      return userProgress;
   } catch (err) {
      return err;
   }
}

export async function progressByCourse(course: string): Promise<UserProgress[]> {
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

export async function progressOverview(course: string): Promise<ProgressOverview> {
   try {
      const progress: UserProgress[] = await progressByCourse(course);
      const progressMap = new Map<string, UserProgress>();
      progress.forEach(element => {
         progressMap.set(element.userName, element);
      });

      // userData is read from local json file, contaiing a list of username
      // TOFIX

      const userProgress = usersData.users.map((userName: any) => {
         if (progressMap.has(userName)) {
            return progressMap.get(userName);
         } else {
            return {
               userName,
               progress: []
            };
         }
      });

      const courseContent = await courseService.getCourseContent(course);

      return {
         userProgress,
         courseInfo: courseContent.courseInfo,
         missions: courseContent.missions,
         targets: courseContent.targets
      };
   } catch (err) {
      console.error(err);
      return err;
   }
}
