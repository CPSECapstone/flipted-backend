import { CompositeDBItem } from "../services/dynamodb";

export function DBKey(prefix: string, id: string) {
   return `${prefix}#${id}`;
}

export type ObjectiveItem = CompositeDBItem & Omit<Objective, "__typename" | "tasks">;

export function ObjectivePK(course: string): string {
   return DBKey("COURSE", course);
}

export function ObjectiveSK(objectiveId: string): string {
   return DBKey("OBJECTIVE", objectiveId);
}
