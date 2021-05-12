import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import { mockMissionProgress, mockTargetProgress } from "./mocks";
import * as service from "./progressService";
import * as courseService from "../services/course";

async function addProgress(_: any, args: MutationAddProgressArgs, context: any, info: any) {
   return await service.addProgress(args.progress);
}

async function progressByCourse(_: any, args: QueryProgressByCourseArgs) {
   return await service.getProgressByCourse(args.course);
}

async function userProgress(_: any, args: QueryUserProgressArgs) {
   return await service.getUserProgress(args.userName, args.course);
}

async function progressOverview(_: any, args: QueryProgressOverviewArgs) {
   return await service.getProgressOverview(args.course);
}

async function getAllMissionProgress(_: any, args: QueryGetAllMissionProgressArgs, context: any, info: any) : Promise<MissionProgress[]> {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username);
   return await service.getAllMissionProgressForUser(args.courseId, tokenPayload.username)
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
