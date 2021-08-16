import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid";
import { COURSE_CONTENT_TABLE_NAME, MARKETPLACE_TABLE } from "../environment";
import dynamodb from "../services/dynamodb";
import userService from "../services/user";
import * as helper from "./courseHelper";
import {
   CourseTeacherItem,
   CourseKey,
   CoursePrefix,
   CourseStudentItem,
   StudentPK,
   StudentPKPrefix,
   StudentSK,
   StudentSKPrefix,
   TeacherPK,
   TeacherSK,
   USER_COURSE_INDEX,
   UserGI_PK
} from "./courseInterface";

export async function addStudent(input: StudentInput) {
   try {
      const courseInfo = getCourseInfo(input.courseId, input.instructorId);
      const userinfo = await userService.get(input.studentId);

      const studentItem = helper.studentInputToDBItem(input, (await courseInfo).courseName, userinfo.name);

      const params: PutCompositeParams = {
         tableName: MARKETPLACE_TABLE,
         item: studentItem,
         conditionalExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      };

      const output = await dynamodb.putComposite(params);
      return studentItem;
   } catch (err) {
      throw err;
   }
}

export async function getStudent(course: string, studentId: string): Promise<Student> {
   const params: GetCompositeParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: StudentPK(course),
         SK: StudentSK(studentId)
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const item = <CourseStudentItem>unmarshall(output.Item);
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
      tableName: MARKETPLACE_TABLE,
      keyConditionExpression: "PK = :courseVal and begins_with(SK, :skPrefix) ",
      expressionAttributeValues: {
         ":courseVal": StudentPK(course),
         ":skPrefix": StudentSKPrefix
      }
   };

   const studentItems: Array<CourseStudentItem> = await dynamodb.queryList<CourseStudentItem>(
      params
   );
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

export async function addCourse(input: CourseInput, instructorId: string, name: string) {
   const courseItem = helper.courseInputToDBItem(input, instructorId, uid(), name);

   const params: PutCompositeParams = {
      tableName: MARKETPLACE_TABLE,
      item: courseItem
   };

   try {
      await dynamodb.putComposite(params);
      return courseItem;
   } catch (err) {
      return err;
   }
}

export async function getCourseInfo(courseId: string, instructorId: string): Promise<CourseInfo> {
   const params: GetCompositeParams = {
      tableName: MARKETPLACE_TABLE,
      key: {
         PK: TeacherPK(courseId),
         SK: TeacherSK(instructorId)
      }
   };
   try {
      const output = await dynamodb.getCompositeDemarshall<CourseInfo>(params);

      if (!output) {
         throw new Error(`Course not found with courseId=${courseId}`);
      }
      return output;
   } catch (err) {
      throw err;
   }
}

export async function listCourseInfos(username: string): Promise<CourseInfo[]> {
   const params: QueryParams = {
      tableName: MARKETPLACE_TABLE,
      indexName: USER_COURSE_INDEX,
      keyConditionExpression: "U_PK = :userpk and begins_with(PK, :pkPrefix)",
      expressionAttributeValues: {
         ":userpk": UserGI_PK(username),
         ":pkPrefix": CoursePrefix
      }
   };

   return await dynamodb.queryList<CourseInfo>(params);
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
   throw new Error("Not implemented");
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
