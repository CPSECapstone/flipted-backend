import * as service from "./progressService";

async function addProgress(_: any, args: MutationAddProgressArgs, context: any, info: any) {
   return service.addProgress(args.progress);
}

async function progressByUserAndCourse(_: any, args: QueryProgressByUserAndCourseArgs) {
   return service.progressByUserAndCourse(args.userName, args.course);
}

async function progressByCourse(_: any, args: QueryProgressByCourseArgs) {
   return service.progressByCourse(args.course);
}

const resolvers = {
   Query: {
      progressByUserAndCourse,
      progressByCourse
   },
   Mutation: {
      addProgress
   }
};

export default resolvers;
