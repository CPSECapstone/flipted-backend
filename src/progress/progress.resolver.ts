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

const resolvers = {
   Query: {
      progressByCourse,
      userProgress,
      progressOverview
   },
   Mutation: {
      addProgress
   }
};

export default resolvers;
