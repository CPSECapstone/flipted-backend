import { uid } from "uid";
import {
   Mission,
   MissionInput,
   MissionItem,
   SubMission,
   SubMissionInput,
   SubMissionItem,
   MissionContent
} from "../interfaces/mission";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import taskService from "./task";

/*
   item - the representation in database
   aggregate task and submissions into a single Mission
*/
export async function dbItemsToMissionContent(items?: any[]): Promise<MissionContent[]> {
   let missionContent: MissionContent[] = [];
   let promises: Promise<MissionContent>[] = [];

   if (!items) return [];

   items.forEach((rawItem: any) => {
      const item = unmarshall(rawItem);
      const [type, id] = item.PK.split("#");

      if (type == "TASK") {
         promises.push(taskService.getTaskById(id));
      } else if (type == "SUBMISSION") {
         missionContent.push(dbItemToSubMission(<SubMissionItem>item));
      }
   });

   let tasks = await Promise.all(promises);
   missionContent = missionContent.concat(tasks);
   missionContent.sort((a, b) => a.parentMissionIndex - b.parentMissionIndex);
   return missionContent;
}

export function dbMissionItemToMission(missionItem: MissionItem): Mission {
   const [type, missionId] = missionItem.PK.split("#");
   return {
      id: missionId,
      name: missionItem.name,
      course: missionItem.course,
      description: missionItem.description,
      missionContent: []
   };
}

export function convertMissionInputToItem(missionInput: MissionInput): MissionItem {
   const mission_uid = uid();
   return {
      PK: `MISSION#${mission_uid}`,
      SK: `MISSION#${mission_uid}`,
      course: missionInput.course,
      name: missionInput.name,
      description: missionInput.description
   };
}

export function convertSubMissionInputToItem(subMissionInput: SubMissionInput): SubMissionItem {
   const sub_uid = uid();
   return {
      PK: `SUBMISSION#${sub_uid}`,
      SK: `SUBMISSION#${sub_uid}`,
      parentMissionId: subMissionInput.parentMissionId,
      parentMissionIndex: subMissionInput.parentMissionIndex,
      name: subMissionInput.name,
      description: subMissionInput.description
   };
}

export function dbItemToSubMission(subMissionItem: SubMissionItem): SubMission {
   const [type, id] = subMissionItem.PK.split("#");
   return {
      id: id,
      parentMissionId: subMissionItem.parentMissionId,
      parentMissionIndex: subMissionItem.parentMissionIndex,
      name: subMissionItem.name,
      description: subMissionItem.description
   };
}
