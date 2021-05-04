import * as service from "../services/course";

async function addCourse(_: any, args: MutationAddCourseArgs, context: any, info: any) {
   return service.addCourse(args.course);
}

async function getCourseInfo(_: any, args: QueryCourseInfoArgs, context: any, info: any) {
   return service.getCourseInfo(args.courseId);
}

async function listCourseInfos(_: any, args: QueryCourseInfosArgs, context: any, info: any) {
   return service.listCourseInfos(args.instructor);
}

async function getCourseContent(_: any, args: QueryCourseContentArgs, context: any, info: any) {
   return service.getCourseContent(args.course);
}

const resolvers = {
   Query: {
      courseInfo: getCourseInfo,
      courseInfos: listCourseInfos,
      courseContent: getCourseContent
   },
   Mutation: {
      addCourse
   }
};

export default resolvers;
