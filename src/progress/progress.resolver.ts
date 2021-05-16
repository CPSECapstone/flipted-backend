import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import * as service from "./progressService";
import { RoleInternal } from "../interfaces/role";
import { getTask } from "../services/task";
import { getObjective } from "../objective/objectiveService";

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

async function getAllMissionProgress(
   _: any,
   args: QueryGetAllMissionProgressArgs,
   context: any,
   info: any
): Promise<MissionProgress[]> {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username);
   return await service.getAllMissionProgressForUser(
      args.courseId,
      userRole == RoleInternal.Instructor && args.username ? args.username : tokenPayload.username
   );
}

async function getAllTargetProgress(
   _: any,
   args: QueryGetAllTargetProgressArgs,
   context: any,
   info: any
) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username);
   return await service.getAllTargetProgressForUser(
      args.courseId,
      userRole == RoleInternal.Instructor && args.username ? args.username : tokenPayload.username
   );
}

const resolvers = {
   Query: {
      progressByCourse,
      userProgress,
      progressOverview,
      getAllMissionProgress,
      getAllTargetProgress
   },
   Mutation: {
      addProgress
   },
   TaskObjectiveProgress: {
      task: getTask,
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
