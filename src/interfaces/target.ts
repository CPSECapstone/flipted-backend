import { CompositeDBItem } from "../services/dynamodb";

export type TargetItem = CompositeDBItem & Omit<Target, "__typename" | "objectives">;

export const TargetSKPrefix = "TARGET";

export function TargetPK(course: string) {
   return `COURSE#${course}`;
}

export function TargetSK(targetId: string) {
   return `${TargetSKPrefix}#${targetId}`;
}
