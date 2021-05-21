export type ObjectiveItem = CompositeDBItem &
   Omit<Objective, "__typename" | "tasks"> & {
      taskIds: string[];
      source?: string;
   };

export const ObjectivePrefix = "OBJECTIVE";

export function ObjectiveKey(objectiveId: string): string {
   return `${ObjectivePrefix}#${objectiveId.replace(ObjectivePrefix + "#", "")}`;
}
