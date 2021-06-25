import { string } from "yargs";

export type CourseTeacherItem = CompositeDBItem & {
   U_PK: string;
   courseName: string;
   courseId: string;
   username: string;
   firstName: string;
   lastName: string;
};

export const CoursePrefix = "COURSE";

export function CourseKey(courseId: string): string {
   return `${CoursePrefix}#${courseId}`;
}

export type StudentItem = CompositeDBItem &
   Omit<Student, "__typename"> & {
      U_SK: string;
   };

export const StudentPKPrefix = "COURSE";
export const TeacherPKPrefix = "COURSE";

export const StudentSKPrefix = "STUDENT";
export const TeacherSKPrefix = "TEACHER";

export const UserGI_PKPrefix = "USER";
export const UserGI_SKPrefix = "COURSE";

export function UserGI_PK(userId: string): string {
   return `${UserGI_PKPrefix}#${userId}`;
}

export function UserGI_SK(courseId: string): string {
   return `${UserGI_SKPrefix}#${courseId}`;
}

export function TeacherPK(courseId: string): string {
   return `${TeacherPKPrefix}#${courseId}`;
}

export function TeacherSK(instructorId: string): string {
   return `${TeacherSKPrefix}#${instructorId}`;
}

export function StudentSK(studentId: string): string {
   return `${StudentSKPrefix}#${studentId}`;
}

export function StudentPK(courseId: string): string {
   return `${StudentPKPrefix}#${courseId}`;
}
