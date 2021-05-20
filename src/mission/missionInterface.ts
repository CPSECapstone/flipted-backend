/***************** Database item ******************************/
export interface MissionItem extends CompositeDBItem {
   course: string;
   name: string;
   description: string;
   source?: string;
}

export interface SubMissionItem extends CompositeDBItem {
   missionId: string;
   missionIndex: number;
   name: string;
   description: string;
}

export const MissionPrefix = "MISSION";

export const SubMissionPrefix = "SUBMISSION";
