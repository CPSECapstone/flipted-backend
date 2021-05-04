import * as service from "./progressService";

async function addProgress(_: any, args: MutationAddProgressArgs, context: any, info: any) {
   return service.addProgress(args.progress);
}

async function progressByCourse(_: any, args: QueryProgressByCourseArgs) {
   return service.progressByCourse(args.course);
}

async function userProgress(_: any, args: QueryUserProgressArgs) {
   return service.userProgress(args.userName, args.course);
}

async function progressOverview(_: any, args: QueryProgressOverviewArgs) {
   return service.progressOverview(args.course);
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
