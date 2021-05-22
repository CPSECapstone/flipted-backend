import { Resolvers } from "../__generated__/resolvers";
import * as service from "./courseService";

const resolvers: Resolvers = {
   Query: {
      courseInfo: (_, args) => {
         return service.getCourseInfo(args.courseId);
      },
      courseInfos: (_, args) => {
         return service.listCourseInfos(args.instructor);
      },
      courseContent: (_, args) => {
         return service.getCourseContent(args.course);
      }
   },
   Mutation: {
      addCourse(_, args) {
         return service.addCourse(args.course);
      }
   }
};

export default resolvers;
