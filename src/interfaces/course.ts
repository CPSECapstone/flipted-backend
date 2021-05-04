import { CompositeDBItem } from "../services/dynamodb";

export type CourseInfoItem = CompositeDBItem & Omit<CourseInfo, "__typename">;

export const CoursePrefix = "COURSE";

export function CourseKey(courseId: string): string {
   return `${CoursePrefix}#${courseId}`;
}
