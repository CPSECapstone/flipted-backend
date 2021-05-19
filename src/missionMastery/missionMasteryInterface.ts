import { CompositeDBItem } from "../services/dynamodb";

export type StudentMissionMasteryItem = CompositeDBItem & {
   currentTaskId: string;
   level: number;
   progress: number;
   source?: string;
};

export const StudentMissionMasteryPKPrefix = "MISSION";
export const StudentMissionMasterySKPrefix = "STUDENT";

export function StudentMissionMasteryPK(missionId: string): string {
   return `MISSION#${missionId}`;
}

export function StudentMissionMasterySK(studentId: string): string {
   return `STUDENT#${studentId}`;
}
