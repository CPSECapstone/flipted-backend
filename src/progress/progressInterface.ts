import { CompositeDBItem } from "../services/dynamodb";

export type ProgressItem = CompositeDBItem & {
   userName: string;
   taskId: string;
   status: boolean;
};

export function ProgressPK(userName: string, course: string): string {
   return `${userName}#${course}`;
}

export function ProgressSK(taskId: string): string {
   return taskId;
}
