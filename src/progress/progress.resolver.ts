import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import { mockMissionProgress, mockTargetProgress } from "./mocks";
import * as service from "./progressService";

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

async function getAllMissionProgress(_: any, args: QueryGetAllMissionProgressArgs, context: any, info: any) {
   return mockMissionProgress
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username);
}

async function getAllTargetProgress(_: any, args: QueryGetAllTargetProgressArgs, context: any, info: any) {
   return mockTargetProgress
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
   Mastery: {
      NOT_GRADED: "NOT_GRADED",
      NOT_MASTERED: "NOT_MASTERED",
      NEARLY_MASTERED: "NEARLY_MASTERED",
      MASTERED: "MASTERED"
   }
};

export default resolvers;
