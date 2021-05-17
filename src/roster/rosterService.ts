import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import dynamodb, {
   BatchWriteParams,
   GetCompositeParams,
   PutCompositeParams,
   QueryParams,
   ScanParams
} from "../services/dynamodb";
import * as helper from "./rosterHelper";
import {
   StudentItem,
   StudentPK,
   StudentPKPrefix,
   StudentSK,
   StudentSKPrefix
} from "./rosterInterface";

export async function addStudent(input: StudentInput) {
   try {
      const studentItem = helper.studentInputToDBItem(input);

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
         PK: StudentPK(course),
         SK: StudentSK(studentId)
      }
   };
   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const item = <StudentItem>unmarshall(output.Item);
         const objective = helper.dbItemToStudent(item);
         return objective;
      }

      throw new Error(`Student not found with course=${course} and studentId=${studentId}`);
   } catch (err) {
      return err;
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

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const students = helper.dbItemsToStudent(output.Items);
         return students;
      }

      return [];
   } catch (err) {
      return err;
   }
}

export async function importStudents(studentInput: StudentInput[]): Promise<number> {
   const items = studentInput.map(helper.studentInputToDBItem);
   const params: BatchWriteParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      items
   };
   try {
      const output = await dynamodb.batchWrite(params);
      if (output.ConsumedCapacity) {
         console.log(output.ConsumedCapacity);
         return output.ConsumedCapacity.length;
      }

      return 0;
   } catch (err) {
      return err;
   }
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
