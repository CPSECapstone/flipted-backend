import { CompositeDBItem } from "../services/dynamodb";

export type CourseInfoItem = CompositeDBItem & Omit<CourseInfo, "__typename">;

export const CourseSKPrefix = "COURSE";

export function CoursePK(course: string): string {
   return `COURSE#${course}`;
}

export function CourseSK(courseId: string): string {
   return `${CourseSKPrefix}#${courseId}`;
}
