import { StudentItem, StudentPK, StudentSK } from "./rosterInterface";

export function studentInputToDBItem(input: StudentInput): StudentItem {
   const item: StudentItem = {
      PK: StudentPK(input.studentId),
      SK: StudentSK(input.course),
      points: 0,
      totalPointsAwarded: 0,
      totalPointsSpent: 0,
      ...input
   };

   return item;
}

export function dbItemToStudent(item: StudentItem): Student {
   return <Student>item;
}
