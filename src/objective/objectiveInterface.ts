import { CompositeDBItem } from "../services/dynamodb";

export type ObjectiveItem = CompositeDBItem &
   Omit<Objective, "__typename" | "tasks"> & {
      taskIds: string[];
   };

export const ObjectivePrefix = "OBJECTIVE";

export function ObjectiveKey(objectiveId: string): string {
   return `${ObjectivePrefix}#${objectiveId}`;
}
