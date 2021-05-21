export type CourseInfoItem = CompositeDBItem &
   Omit<CourseInfo, "__typename"> & {
      source?: string;
   };

export const CoursePrefix = "COURSE";

export function CourseKey(courseId: string): string {
   return `${CoursePrefix}#${courseId}`;
}
