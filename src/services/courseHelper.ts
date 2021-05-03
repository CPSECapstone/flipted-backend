import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { CourseInfoItem, CourseKey, CoursePrefix } from "../interfaces/course";
import { MissionItem } from "../interfaces/mission";
import { ObjectiveItem, ObjectivePrefix } from "../interfaces/objective";
import { TargetItem, TargetPrefix } from "../interfaces/target";
import { TaskInfoItem, TaskInfoPrefix } from "../interfaces/taskInfo";
import { dbMissionItemToMission } from "./missionLogic";
import { dbItemToObjective } from "./objectiveHelper";
import { dbItemToTarget } from "./targetHelper";
import { dbItemToTaskInfo } from "./taskInfoHelper";

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
   const missions: Mission[] = [];
   const targets: Target[] = [];
   const objectives: Objective[] = [];
   const taskInfos: TaskInfo[] = [];
   let courseInfo: CourseInfo | undefined;

   if (!items) {
      throw new Error("Course not found");
   }

   items.forEach(rawItem => {
      const item = unmarshall(rawItem);
      const [type, id] = item["PK"].split("#");
      if (type == CoursePrefix) {
         courseInfo = dbItemToCourseInfo(rawItem);
      } else if (type == ObjectivePrefix) {
         const objective = dbItemToObjective(<ObjectiveItem>item);
         objectives.push(objective);
      } else if (type == TargetPrefix) {
         const target = dbItemToTarget(<TargetItem>item);
         targets.push(target);
      } else if (type == TaskInfoPrefix) {
         const taskInfo = dbItemToTaskInfo(<TaskInfoItem>item);
         taskInfos.push(taskInfo);
      } else if (type == "MISSION") {
         const mission = dbMissionItemToMission(<MissionItem>item);
         missions.push(mission);
      }
   });

   if (!courseInfo) {
      throw new Error("Course not found");
   }

   return {
      courseInfo,
      missions,
      targets,
      objectives,
      taskInfos
   };
}
