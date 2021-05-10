import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import { mockMissionProgress } from "./mocks";
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

const resolvers = {
   Query: {
      progressByCourse,
      userProgress,
      progressOverview,
      getAllMissionProgress
   },
   Mutation: {
      addProgress
   }
};

export default resolvers;
