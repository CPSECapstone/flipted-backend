import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { CourseInfoItem, CourseKey, CoursePrefix } from "../interfaces/course";
import {
   MissionItem,
   MissionPrefix,
   SubMissionItem,
   SubMissionPrefix
} from "../interfaces/mission";
import { ObjectiveItem, ObjectivePrefix } from "../interfaces/objective";
import { TargetItem, TargetPrefix } from "../interfaces/target";
import { TaskPrefix } from "../interfaces/task";
import { dbItemToSubMission, dbMissionItemToMission } from "./missionLogic";
import { dbItemToObjective } from "./objectiveHelper";
import { dbItemToTarget } from "./targetHelper";
import { dbItemToTask } from "./taskBusLogic";

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

function parseCourseItems(
   items: any[]
): [
   CourseInfo,
   Map<string, Mission>,
   Map<string, SubMission>,
   Map<string, Target>,
   Map<string, Objective>,
   Map<string, Task>
] {
   const missionMap = new Map<string, Mission>();
   const subMissionMap = new Map<string, SubMission>();
   const targetMap = new Map<string, Target>();
   const objectiveMap = new Map<string, Objective>();
   const taskMap = new Map<string, Task>();

   let courseInfo: CourseInfo | undefined;

   items.forEach(rawItem => {
      const item = unmarshall(rawItem);
      const [type, id] = item["PK"].split("#");
      if (type == CoursePrefix) {
         courseInfo = dbItemToCourseInfo(rawItem);
      } else if (type == ObjectivePrefix) {
         const objective = dbItemToObjective(<ObjectiveItem>item);
         objectiveMap.set(id, objective);
      } else if (type == TargetPrefix) {
         const target = dbItemToTarget(<TargetItem>item);
         targetMap.set(id, target);
      } else if (type == MissionPrefix) {
         const mission = dbMissionItemToMission(<MissionItem>item);
         missionMap.set(id, mission);
      } else if (type == TaskPrefix) {
         const task = dbItemToTask(rawItem);
         taskMap.set(id, task);
      } else if (type == SubMissionPrefix) {
         const subMission = dbItemToSubMission(<SubMissionItem>item);
         subMissionMap.set(id, subMission);
      }
   });

   if (!courseInfo) {
      throw new Error("Course not found");
   }

   return [courseInfo, missionMap, subMissionMap, targetMap, objectiveMap, taskMap];
}

export function dbItemsToCourseContent(items: any[]): CourseContent {
   const [
      courseInfo,
      missionMap,
      subMissionMap,
      targetMap,
      objectiveMap,
      taskMap
   ] = parseCourseItems(items);

   for (let [, task] of taskMap) {
      if (task.objectiveId && objectiveMap.has(task.objectiveId)) {
         objectiveMap.get(task.objectiveId)?.tasks?.push(task);
      }

      if (task.subMissionId && missionMap.has(task.subMissionId)) {
         subMissionMap.get(task.subMissionId)?.missionContent?.push(task);
      }

      if (task.missionId && missionMap.has(task.missionId)) {
         missionMap.get(task.missionId)?.missionContent?.push(task);
      }
   }

   for (let [, subMission] of subMissionMap) {
      if (subMission.missionId && missionMap.has(subMission.missionId)) {
         missionMap.get(subMission.missionId)?.missionContent?.push(subMission);
      }
   }

   for (let [, objective] of objectiveMap) {
      if (targetMap.has(objective.targetId)) {
         targetMap.get(objective.targetId)?.objectives?.push(objective);
      }
   }

   return {
      courseInfo,
      missions: Array.from(missionMap.values()),
      targets: Array.from(targetMap.values())
   };
}
