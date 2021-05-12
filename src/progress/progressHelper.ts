import { unmarshall } from "@aws-sdk/util-dynamodb";
import { dbItemToTaskSubmissionResult } from "../submissions/taskSubmissionHelper";
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

function generateTaskStats(mission: Mission,  tasks: Task[], submissions: TaskSubmissionResultItem[]) : TaskStats[] {
   const ret: TaskStats[] = []
   for (var task of tasks) {
      
      if(task.missionId != mission.id) throw new Error("Invalid parameter! All tasks must have mission id of provided mission")

      const submissionResult: TaskSubmissionResultItem | undefined = submissions.find(submission => {
         return submission.SK == task.id
      })

      var taskStat: TaskStats = {
         taskId: task.id,
         name: task.name,
      }

      if(submissionResult) {
         taskStat.submission = dbItemToTaskSubmissionResult(submissionResult)
      }

      ret.push(taskStat)
   }
   return ret
}

export function generateMissionProgress(missions: Mission[], tasks: Task[], submissions: TaskSubmissionResultItem[], user: string): MissionProgress[] {
   const ret: MissionProgress[] = []
   for (var mission of missions) {
      const filteredTasks: Task[] = tasks.filter(task => {
         return task.missionId == mission.id
      });
   
      const filteredResults: TaskSubmissionResultItem[] = submissions.filter(submission => {
         return submission.missionId == mission.id
      })

      var missionProg: MissionProgress = {
         mission: mission, 
         student: user,
         progress: generateTaskStats(mission, filteredTasks, filteredResults)
      }

      ret.push(missionProg)
   }
   return ret
}
