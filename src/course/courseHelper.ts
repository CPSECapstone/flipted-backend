import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import {
   CourseTeacherItem,
   CourseKey,
   CoursePrefix,
   CourseStudentItem,
   StudentPK,
   StudentSK,
   UserGI_PK,
   TeacherPK,
   TeacherSK
} from "./courseInterface";
import {
   MissionItem,
   MissionPrefix,
   SubMissionItem,
   SubMissionPrefix
} from "../mission/missionInterface";
import { ObjectiveItem, ObjectivePrefix } from "../objective/objectiveInterface";
import { TargetItem, TargetPrefix } from "../target/targetInterface";
import { TaskPrefix } from "../interfaces/task";
import * as missionLogic from "../mission/missionLogic";
import { dbItemToObjective } from "../objective/objectiveHelper";
import { dbItemToTarget } from "../target/targetHelper";
import { dbItemToTask } from "../task/taskBusLogic";

export function courseInputToDBItem(input: CourseInput, instructorId: string, courseId: string) {
   const item: CourseTeacherItem = {
      PK: TeacherPK(courseId),
      SK: TeacherSK(instructorId),
      U_PK: UserGI_PK(instructorId),
      courseId: courseId,
      instructorId: instructorId,
      courseName: input.courseName,
      firstName: input.firstName,
      lastName: input.lastName
   };

   return item;
}

export function studentInputToDBItem(input: StudentInput, courseName: string): CourseStudentItem {
   const item: CourseStudentItem = {
      PK: StudentPK(input.courseId),
      SK: StudentSK(input.studentId),
      U_PK: UserGI_PK(input.studentId),
      points: 0,
      totalPointsAwarded: 0,
      totalPointsSpent: 0,
      courseName: courseName,
      courseId: input.courseId,
      studentId: input.studentId,
      firstName: input.firstName,
      lastName: input.lastName,
      instructorId: input.instructorId,
      purchaseBlocked: false
   };

   return item;
}

export function dbItemToStudent(item: CourseStudentItem): Student {
   return <Student>item;
}

export function dbItemToCourseInfo(rawItem: any): CourseInfo {
   const item = <CourseTeacherItem>unmarshall(rawItem);
   return <CourseInfo>{
      courseId: item.courseId,
      courseName: item.courseName,
      instructorId: item.instructorId
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
         const mission = missionLogic.dbMissionItemToMission(<MissionItem>item);
         missionMap.set(id, mission);
      } else if (type == TaskPrefix) {
         const task = dbItemToTask(rawItem);
         taskMap.set(id, task);
      } else if (type == SubMissionPrefix) {
         const subMission = missionLogic.dbItemToSubMission(<SubMissionItem>item);
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
