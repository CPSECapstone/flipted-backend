import { CompositeDBItem } from "../services/dynamodb";

export type TargetItem = CompositeDBItem & Omit<Target, "__typename" | "objectives">;

export const TargetPrefix = "TARGET";

export function TargetKey(targetId: string) {
   return `${TargetPrefix}#${targetId}`;
}
