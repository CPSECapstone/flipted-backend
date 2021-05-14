import { CompositeDBItem } from "../services/dynamodb";

export type ObjectiveItem = CompositeDBItem &
   Omit<Objective, "__typename" | "tasks"> & {
      taskIds: string[];
   };
   objectiveId: string,
   objectiveName: string;
   description: string;
   targetId: string;
   targetName: string;
   course: string;
   tasks: string[]
}

export const ObjectivePrefix = "OBJECTIVE";

export function ObjectiveKey(objectiveId: string): string {
   return `${ObjectivePrefix}#${objectiveId}`;
}
