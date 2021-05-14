import { CompositeDBItem } from "../services/dynamodb";

export type ProgressItem = CompositeDBItem & {
   userName: string;
   taskId: string;
   status: boolean;
};

// PK: TASK#XXXX
// SK: OBJECTIVE#XXXX
export type MasteryItem = CompositeDBItem & {
   username: string,
   taskId: string,
   objectiveId: string,
   course: string,
   mastery: string // maps to the mastery enum 
}

export function MasteryPK(taskId: string) : string {
   return `TASK#${taskId.replace("TASK#", "")}`
}

export function MasterySK(objectiveId: string) : string {
   return `OBJECTIVE#${objectiveId.replace("OBJECTIVE#", "")}`
}

export function ProgressPK(userName: string, course: string): string {
   return `${userName}#${course}`;
}

export function ProgressSK(taskId: string): string {
   return taskId;
}
