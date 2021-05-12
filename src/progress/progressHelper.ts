import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TaskSubmissionResultItem } from "../submissions/taskSubmissionInterface";
import { ProgressPK, ProgressSK } from "./progressInterface";
import { ProgressItem } from "./progressInterface";

export function progressInputToDBItem(input: ProgressInput): ProgressItem {
   const item: ProgressItem = {
      PK: ProgressPK(input.userName, input.course),
      SK: ProgressSK(input.taskId),
      ...input
   };

   return item;
}

export function dbItemsToUserProgress(userName: string, items: any[]): UserProgress {
   let progressList: Progress[] = [];
   if (items) {
      items.forEach((rawItem: any) => {
         const item = <ProgressItem>unmarshall(rawItem);
         const progress = <Progress>{
            taskId: item.taskId,
            status: item.status
         };
         progressList.push(progress);
      });
   }

   return {
      userName,
      progress: progressList
   };
}

export function dbItemsToProgressList(items: any[]): UserProgress[] {
   const progressMap = new Map<string, Progress[]>();

   items.forEach(rawItem => {
      const item = <ProgressItem>unmarshall(rawItem);
      const progress = <Progress>{
         taskId: item.taskId,
         status: item.status
      };

      if (progressMap.has(item.userName)) {
         progressMap.get(item.userName)?.push(progress);
      } else {
         progressMap.set(item.userName, [progress]);
      }
   });

   const progressList: UserProgress[] = [];
   for (let [key, value] of progressMap) {
      progressList.push(<UserProgress>{
         userName: key,
         progress: value
      });
   }

   return progressList;
}

export function generateMissionProgress(missions: Mission[], arg1: Task[], arg2: TaskSubmissionResultItem[]): MissionProgress[] {
   throw new Error("Function not implemented.");
}
