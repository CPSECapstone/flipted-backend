export type StudentItem = CompositeDBItem & Omit<Student, "__typename">;

export const StudentPKPrefix = "STUDENT";
export const StudentSKPrefix = "COURSE";

export function StudentPK(studentId: string): string {
   return `${StudentPKPrefix}#${studentId}`;
}

export function StudentSK(courseId: string): string {
   return `${StudentSKPrefix}#${courseId}`;
}
