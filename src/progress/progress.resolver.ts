import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import * as service from "./progressService";
import { RoleInternal } from "../interfaces/role";
import { getObjective } from "../objective/objectiveService";
import { MasteryItem } from "./progressInterface";
import { dbItemToMastery } from "./progressHelper";
import { ForbiddenError } from "apollo-server-lambda";
import taskService from "../task/task.service";
import { generateTaskSubmission } from "../submissions/taskSubmission";
import { Resolver } from "../__generated__/resolvers";

async function addProgress(_: any, args: MutationAddProgressArgs, context: any, info: any) {
   return service.addProgress(args.progress);
}

async function progressByCourse(_: any, args: QueryProgressByCourseArgs) {
   return service.getProgressByCourse(args.course);
}

async function userProgress(_: any, args: QueryUserProgressArgs) {
   return service.getUserProgress(args.userName, args.course);
}

async function progressOverview(_: any, args: QueryProgressOverviewArgs) {
   return service.getProgressOverview(args.course);
}

async function getUserMissionProgress(_: any, args: QueryUserMissionProgressArgs) {
   return service.getUserMissionProgress(args.missionId, args.username);
}

async function getAllMissionProgress(
   _: any,
   args: QueryGetAllMissionProgressArgs,
   context: FliptedContext,
   info: any
): Promise<MissionProgress[]> {
   const user =
      context.userRole == RoleInternal.Instructor && context.username
         ? context.username
         : context.username;

   return await service.getAllMissionProgressForUser(args.courseId, user);
}

async function getAllTargetProgress(
   _: any,
   args: QueryGetAllTargetProgressArgs,
   context: FliptedContext,
   info: any
) {
   const user =
      context.userRole == RoleInternal.Instructor && args.username
         ? args.username
         : context.username;
   console.log(user);
   console.log(context.userRole);
   return await service.getAllTargetProgressForUser(args.courseId, user);
}

async function getTaskObjectiveProgress(
   _: any,
   args: QueryGetTaskObjectiveProgressArgs,
   context: FliptedContext,
   info: any
) {
   const user =
      context.userRole == RoleInternal.Instructor && args.username
         ? args.username
         : context.username;

   const items = await service.listUserMasteryItemsByTask(user, args.taskId);

   const objectiveIdsForTask: string[] = await service.listObjectivesIdsByTask(args.taskId);

   return objectiveIdsForTask.map(objectiveId => {
      const masteryItem: MasteryItem | undefined = items.find(item => {
         return item.objectiveId == objectiveId;
      });

      if (masteryItem) {
         return dbItemToMastery(masteryItem);
      }

      // No mastery item exists, but we still want an entry
      // could potentially create "NOT_SUBMITTED" as an option in the future
      return {
         objectiveId: objectiveId,
         taskId: args.taskId,
         mastery: "NOT_GRADED" as Mastery
      };
   });
}

async function wipeAllProgress(_: any, args: MutationWipeAllProgressArgs, context: FliptedContext) {
   if (context.userRole != RoleInternal.Instructor) {
      throw new ForbiddenError(`User ${context.username} is not an authorized instructor.`);
   }

   await service.wipeAllProgressForUser(args.username);
   return "success";
}

const resolvers = {
   Query: {
      progressByCourse,
      userProgress,
      progressOverview,
      getAllMissionProgress,
      getAllTargetProgress,
      getTaskObjectiveProgress,
      userMissionProgress: getUserMissionProgress
   },
   Mutation: {
      addProgress,
      wipeAllProgress
   },
   TaskStats: {
      submission: async (_: any, args: any, context: FliptedContext) => {
         try {
            const res = await generateTaskSubmission(_.taskId, context.username);
            console.log("Found Submission");
            return res;
         } catch (err) {
            // task submission doesnt exist
            // TODO:  if we encounter other errors
            return null;
         }
      }
   },
   TaskObjectiveProgress: {
      task: (parent: any) => {
         return taskService.getTaskInfoById(parent.taskId);
      },
      objective: getObjective
   },
   Mastery: {
      NOT_GRADED: "NOT_GRADED",
      NOT_MASTERED: "NOT_MASTERED",
      NEARLY_MASTERED: "NEARLY_MASTERED",
      MASTERED: "MASTERED"
   }
};

export default resolvers;
