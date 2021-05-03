import { CompositeDBItem } from "../services/dynamodb";

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
