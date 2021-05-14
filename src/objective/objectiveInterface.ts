import { CompositeDBItem } from "../services/dynamodb";

export type ObjectiveItem = CompositeDBItem & {
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
