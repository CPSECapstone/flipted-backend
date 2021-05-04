import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import dynamodb, {
   GetCompositeParams,
   PutCompositeParams,
   ScanParams,
   QueryParams
} from "./dynamodb";
import * as helper from "./courseHelper";
import { CourseKey, CoursePrefix } from "../interfaces/course";

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

export async function getCourseInfo(courseId: string): Promise<CourseInfo> {
   const params: GetCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: CourseKey(courseId),
         SK: CourseKey(courseId)
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
         ":skPrefix": CoursePrefix,
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

export async function getCourseContent(course: string): Promise<CourseContent> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal",
      expressionAttributeValues: {
         ":courseVal": course
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const courseContent = helper.dbItemsToCourseContent(output.Items);
         return courseContent;
      }

      throw new Error(`Course not found with courseName=${course}`);
   } catch (err) {
      return err;
   }
}
