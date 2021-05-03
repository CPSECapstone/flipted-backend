import { CompositeDBItem } from "../services/dynamodb";

export type TargetItem = CompositeDBItem & Omit<Target, "__typename" | "objectives">;

export const TargetSKPrefix = "TARGET";

export function TargetPK(courseName: string) {
   return `COURSE#${courseName}`;
}

export function TargetSK(targetName: string) {
   return `${TargetSKPrefix}#${targetName}`;
}
