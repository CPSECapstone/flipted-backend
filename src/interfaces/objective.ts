import { CompositeDBItem } from "../services/dynamodb";

export type ObjectiveItem = CompositeDBItem & Omit<Objective, "__typename" | "tasks">;

export const ObjectiveSKPrefix = "OBJECTIVE";

export function ObjectivePK(courseName: string): string {
   return `COURSE#${courseName}`;
}

export function ObjectiveSK(objectiveName: string): string {
   return `${ObjectiveSKPrefix}#${objectiveName}`;
}
