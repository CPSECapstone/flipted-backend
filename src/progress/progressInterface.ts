export type ProgressItem = CompositeDBItem & {
   userName: string;
   taskId: string;
   status: boolean;
};

// PK: USER#XXXX
// SK: OBJECTIVE#XXXXTASK#XXXX
export type MasteryItem = CompositeDBItem & {
   username: string;
   taskId: string;
   objectiveId: string;
   course: string;
   mastery: string; // maps to the mastery enum
   source?: string;
};

export function MasteryPK(username: string): string {
   return `USERNAME#${username}`;
}

export function MasterySK(objectiveId: string, taskId: string): string {
   return `OBJECTIVE#${objectiveId}TASK#${taskId}`;
}

export function ProgressPK(userName: string, course: string): string {
   return `${userName}#${course}`;
}

export function ProgressSK(taskId: string): string {
   return taskId;
}
