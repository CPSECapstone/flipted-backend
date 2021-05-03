import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import dynamodb, {
   GetCompositeParams,
   PutCompositeParams,
   ScanParams,
   QueryParams
} from "./dynamodb";
import * as helper from "./courseHelper";
import { CoursePK, CourseSK, CourseSKPrefix } from "../interfaces/course";

export async function addCourse(input: CourseInput) {
   const courseItem = helper.courseInputToDBItem(input);

   const params: PutCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      item: courseItem
   };

   try {
      const output = dynamodb.putComposite(params);
      return courseItem.SK;
   } catch (err) {
      return err;
   }
}

export async function getCourseInfo(courseName: string, courseId: string): Promise<CourseInfo> {
   const params: GetCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: CoursePK(courseName),
         SK: CourseSK(courseId)
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const objective = helper.dbItemToCourseInfo(output.Item);
         return objective;
      }

      throw new Error(`Course not found with courseId=${courseId}`);
   } catch (err) {
      return err;
   }
}

export async function listCourseInfos(instructor: string): Promise<CourseInfo[]> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "begins_with(SK, :skPrefix) And instructor = :instructorVal",
      expressionAttributeValues: {
         ":skPrefix": CourseSKPrefix,
         ":instructorVal": instructor
      }
   };

   try {
      const output = await dynamodb.scan(params);
      if (output.Items) {
         const courses = helper.dbItemsToCourseInfos(output.Items);
         return courses;
      }

      return [];
   } catch (err) {
      console.error(err);
      return err;
   }
}

export async function getCourseContent(courseName: string): Promise<CourseContent> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      keyConditionExpression: "PK = :pkVal",
      expressionAttributeValues: {
         ":pkVal": CoursePK(courseName)
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const courseContent = helper.dbItemsToCourseContent(output.Items);
         return courseContent;
      }

      throw new Error(`Course not found with courseName=${courseName}`);
   } catch (err) {
      return err;
   }
}
