import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ObjectiveItem } from "../objective/objectiveInterface";
import { dbItemToTaskSubmissionResult } from "../submissions/taskSubmissionHelper";
import { TaskSubmissionResultItem } from "../submissions/taskSubmissionInterface";
import { MasteryItem, ProgressPK, ProgressSK } from "./progressInterface";
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

function generateTaskStats(
   mission: Mission,
   tasks: Task[],
   submissions: TaskSubmissionResultItem[]
): TaskStats[] {
   const ret: TaskStats[] = [];
   for (let task of tasks) {
      if (task.missionId != mission.id)
         throw new Error("Invalid parameter! All tasks must have mission id of provided mission");

      const submissionResult: TaskSubmissionResultItem | undefined = submissions.find(
         submission => {
            return submission.SK == task.id;
         }
      );

      let taskStat: TaskStats = {
         taskId: task.id,
         name: task.name
      };

      if (submissionResult) {
         taskStat.submission = dbItemToTaskSubmissionResult(submissionResult);
      }

      ret.push(taskStat);
   }
   return ret;
}

export function generateMissionProgress(
   missions: Mission[],
   tasks: Task[],
   submissions: TaskSubmissionResultItem[],
   user: string
): MissionProgress[] {
   const ret: MissionProgress[] = [];
   for (let mission of missions) {
      const filteredTasks: Task[] = tasks.filter(task => {
         return task.missionId == mission.id;
      });

      const filteredResults: TaskSubmissionResultItem[] = submissions.filter(submission => {
         return submission.missionId == mission.id;
      });

      const missionProg: MissionProgress = {
         mission: mission,
         student: user,
         progress: generateTaskStats(mission, filteredTasks, filteredResults)
      };

      ret.push(missionProg);
   }
   return ret;
}

export function dbItemToMastery(item: MasteryItem) {
   // we return just the task / objective id here
   // the TaskObjectiveProgress resolver converts these into their corresponding objects
   return {
      taskId: item.taskId,
      objectiveId: item.objectiveId,
      mastery: item.mastery as Mastery
   };
}

function generateObjectiveProgress(
   filteredObjectiveItems: ObjectiveItem[],
   userMasteryItems: MasteryItem[]
) {
   let ret = [];

   for (let obj of filteredObjectiveItems) {
      // get only the mastery items associated with this objective
      const filteredMasteryItems: MasteryItem[] = userMasteryItems.filter(item => {
         return item.objectiveId == obj.objectiveId;
      });

      ret.push({
         objectiveId: obj.objectiveId,
         objectiveName: obj.objectiveName,
         tasks: obj.taskIds.map(taskId => {
            const masteryItem: MasteryItem | undefined = filteredMasteryItems.find(item => {
               return item.taskId == taskId;
            });

            if (masteryItem) {
               return dbItemToMastery(masteryItem);
            }

            // No mastery item exists, but we still want an entry
            // could potentially create "NOT_SUBMITTED" as an option in the future
            return {
               objectiveId: obj.objectiveId,
               taskId: taskId,
               mastery: "NOT_GRADED" as Mastery
            };
         })
      });
   }

   return ret;
}

export function generateTargetProgress(
   targets: Target[],
   objectives: ObjectiveItem[],
   userMasteryItems: MasteryItem[],
   user: string
) {
   const ret = [];
   for (let target of targets) {
      // get only the objectives associated with this target
      const filteredObjectives: ObjectiveItem[] = objectives.filter(obj => {
         return obj.targetId == target.targetId;
      });

      ret.push({
         target: target,
         objectives: generateObjectiveProgress(filteredObjectives, userMasteryItems),
         student: user
      });
   }

   return ret;
}
