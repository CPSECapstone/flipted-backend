import { unmarshall } from "@aws-sdk/util-dynamodb";
import { StudentItem, StudentPK, StudentSK } from "./rosterInterface";

export function studentInputToDBItem(input: StudentInput): StudentItem {
   const item: StudentItem = {
      PK: StudentPK(input.studentId),
      SK: StudentSK(input.course),
      ...input
   };

   return item;
}

export function dbItemToStudent(item: StudentItem): Student {
   return <Student>item;
}

export function dbItemsToStudent(items: any[]): Student[] {
   const students = items.map(rawItem => {
      const item = <StudentItem>unmarshall(rawItem);
      const student = dbItemToStudent(item);
      return student;
   });

   return students;
}
