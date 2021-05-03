import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { CourseInfoItem, CourseKey } from "../interfaces/course";

export function courseInputToDBItem(input: CourseInput): CourseInfoItem {
   const courseId = uid();

   const item: CourseInfoItem = {
      PK: CourseKey(courseId),
      SK: CourseKey(courseId),
      courseId: courseId,
      ...input
   };

   return item;
}

export function dbItemToCourseInfo(rawItem: any): CourseInfo {
   const item = <CourseInfoItem>unmarshall(rawItem);
   return <CourseInfo>{
      courseId: item.courseId,
      course: item.course,
      description: item.description,
      instructor: item.instructor
   };
}

export function dbItemsToCourseInfos(items: any[]): CourseInfo[] {
   const courses = items.map(rawItem => {
      const course = dbItemToCourseInfo(rawItem);
      return course;
   });

   return courses;
}

export function dbItemsToCourseContent(items: any[]): CourseContent {
   const courses = items.map(rawItem => {
      const course = dbItemToCourseInfo(rawItem);
      return course;
   });

   return {
      missions: [],
      targets: [],
      objectives: []
   };
}
