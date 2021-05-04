import { CompositeDBItem } from "../services/dynamodb";

export type ProgressItem = CompositeDBItem & Omit<Progress, "__typename">;

export function ProgressPK(userName: String, course: String): string {
   return `${userName}#${course}`;
}

export function ProgressSK(taskId: string): string {
   return taskId;
}
