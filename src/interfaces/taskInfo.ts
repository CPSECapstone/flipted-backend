import { CompositeDBItem } from "../services/dynamodb";

export type TaskInfoItem = CompositeDBItem & Omit<TaskInfo, "__typename">;

export const TaskInfoPrefix = "TASKINFO";

export function TaskInfoKey(taskInfoId: string): string {
   return `${TaskInfoPrefix}#${taskInfoId}`;
}
