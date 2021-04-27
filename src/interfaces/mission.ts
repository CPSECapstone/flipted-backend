import { Task } from "./taskInterfaces";
import { CompositeDBItem } from "../services/dynamodb";

/***************** Input from Client *****************************/

export interface MissionInput {
   course: string;
   name: string;
   description: string;
}

export interface SubMissionInput {
   name: string;
   description: string;
   parentMissionId: string;
   parentMissionIndex: number;
}

/***************** Output to Client *****************************/

//export type MissionContent = SubMission | Task

export interface MissionContent {
   parentMissionId: string;
   parentMissionIndex: number;
}

export interface Mission {
   id: string;
   course: string;
   name: string;
   description: string;
   missionContent: MissionContent[];
}

export interface SubMission extends MissionContent {
   id: string;
   name: string;
   description: string;
   missionContent?: MissionContent[];
}

/***************** Database item ******************************/

export interface MissionItem extends CompositeDBItem {
   course: string;
   name: string;
   description: string;
}

export interface SubMissionItem extends CompositeDBItem {
   parentMissionId: string;
   parentMissionIndex: number;
   name: string;
   description: string;
}
