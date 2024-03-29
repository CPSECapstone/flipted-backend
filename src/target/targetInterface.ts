export type TargetItem = CompositeDBItem &
   Omit<Target, "__typename" | "objectives"> & {
      source?: string;
   };

export const TargetPrefix = "TARGET";

export function TargetKey(targetId: string) {
   return `${TargetPrefix}#${targetId}`;
}
