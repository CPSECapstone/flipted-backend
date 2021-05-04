import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ProgressPK, ProgressSK } from "./progressInterface";
import { ProgressItem } from "./progressInterface";

export function progressInputToDBItem(input: Progress): ProgressItem {
   const item: ProgressItem = {
      PK: ProgressPK(input.userName, input.course),
      SK: ProgressSK(input.taskId),
      ...input
   };

   return item;
}

export function dbItemToProgress(item: ProgressItem): Progress {
   return item;
}

export function dbItemsToProgressList(items: any[]): Progress[] {
   const progressList = items.map(rawItem => {
      const item = <ProgressItem>unmarshall(rawItem);
      const progress = dbItemToProgress(item);
      return progress;
   });

   return progressList;
}
