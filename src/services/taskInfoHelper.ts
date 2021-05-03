import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { TaskInfoItem, TaskInfoKey } from "../interfaces/taskInfo";

export function taskInfoInputToDBItem(input: TaskInfoInput): TaskInfoItem {
   const taskInfoId = uid();

   const item: TaskInfoItem = {
      PK: TaskInfoKey(taskInfoId),
      SK: TaskInfoKey(taskInfoId),
      taskInfoId,
      ...input
   };

   return item;
}

export function dbItemToTaskInfo(item: TaskInfoItem): TaskInfo {
   return <TaskInfo>{
      taskInfoId: item.taskInfoId,
      taskName: item.taskName,
      course: item.course,
      targetId: item.targetId,
      objectiveId: item.objectiveId,
      missionId: item.missionId,
      subMissionId: item.subMissionId
   };
}

export function dbItemsToTaskInfos(items: any[]): TaskInfo[] {
   const taskInfos = items.map(rawItem => {
      const item = <TaskInfoItem>unmarshall(rawItem);
      const taskInfo = dbItemToTaskInfo(item);
      return taskInfo;
   });

   return taskInfos;
}
