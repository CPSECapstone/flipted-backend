import { CompositeDBItem } from "../services/dynamodb";

export type ObjectiveItem = CompositeDBItem & Omit<Objective, "__typename" | "tasks">;

export function ObjectivePK(course: string): string {
   return `COURSE#${course}`;
}

export function ObjectiveSK(objectiveId: string): string {
   return `OBJECTIVE#${objectiveId}`;
}
