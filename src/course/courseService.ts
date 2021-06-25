import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import dynamodb from "../services/dynamodb";
import * as helper from "./courseHelper";
import {
   CourseTeacherItem,
   CourseKey,
   CoursePrefix,
   StudentItem,
   StudentPK,
   StudentPKPrefix,
   StudentSK,
   StudentSKPrefix
} from "./courseInterface";

export async function addStudent(input: StudentInput) {
   throw new Error("Not Implemented");

   try {
      const courseName = "IMPLEMENT ME";
      const studentItem = helper.studentInputToDBItem(input, courseName);

      const params: PutCompositeParams = {
         tableName: COURSE_CONTENT_TABLE_NAME,
         item: studentItem
      };

      const output = await dynamodb.putComposite(params);
      return studentItem.PK;
   } catch (err) {
      return err;
   }
}

export async function getStudent(course: string, studentId: string): Promise<Student> {
   const params: GetCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: StudentPK(studentId),
         SK: StudentSK(course)
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const item = <StudentItem>unmarshall(output.Item);
         const student = helper.dbItemToStudent(item);
         return student;
      }

      throw new Error(`Student not found with course=${course} and studentId=${studentId}`);
   } catch (err) {
      throw err;
   }
}

export async function listStudentsByCourse(course: string): Promise<Student[]> {
   const params: QueryParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :pkPrefix) ",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkPrefix": StudentPKPrefix
      }
   };

   const studentItems: Array<StudentItem> = await dynamodb.queryList<StudentItem>(params);
   return studentItems.map(helper.dbItemToStudent);
}

export async function importStudents(studentInput: StudentInput[]): Promise<number> {
   throw new Error("Not Implemented");
}

export async function deleteStudents(): Promise<number> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "begins_with(PK, :pkPrefix) and begins_with(SK, :skPrefix)",
      expressionAttributeValues: {
         ":pkPrefix": StudentPKPrefix,
         ":skPrefix": StudentSKPrefix
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}

export async function addCourse(input: CourseInput, instructorId: string) {
   const courseItem = helper.courseInputToDBItem(input, instructorId);

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

export async function listCourseInfos(username: string): Promise<CourseInfo[]> {
   throw new Error("NOT IMPLEMENTED");
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

export async function importCourses(courseItems: CourseTeacherItem[]): Promise<number> {
  throw new Error("Not implemented")
}

export async function deleteCourses(): Promise<number> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "begins_with(PK, :pkPrefix)",
      expressionAttributeValues: {
         ":pkPrefix": CoursePrefix
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}
