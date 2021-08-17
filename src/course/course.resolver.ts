import { ForbiddenError } from "apollo-server-lambda";
import { notInstructorErrorMessage } from "../environment";
import { RoleInternal } from "../interfaces/role";
import { Resolvers } from "../__generated__/resolvers";
import * as service from "./courseService";

async function addStudent(_: any, args: MutationAddStudentArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor) {
      args.student.instructorId = context.username
      return service.addStudent(args.student);
   }
   args.student.studentId = context.username
   return service.addStudent(args.student);
}

async function getStudent(_: any, args: QueryStudentArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor || (await service.isCourseAdmin(args.courseId, context.username))) {
      if (!args.studentId) {
         throw new Error("Instructor did not provide a student to query");
      }
      return service.getStudent(args.courseId, args.studentId);
   }
   return service.getStudent(args.courseId, context.username);
}

async function listStudentsByCourse(_: any, args: QueryStudentsArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor || (await service.isCourseAdmin(args.courseId, context.username))) {
      return service.listStudentsByCourse(args.courseId);
   }
   throw new ForbiddenError(notInstructorErrorMessage);
}

const resolvers: Resolvers = {
   Query: {
      student: getStudent,
      students: listStudentsByCourse,
      course: (_, args, context) => {
         return service.getCourseInfo(args.courseId, args.instructorId);
      },
      courses: (_, args, context: FliptedContext) => {
         return service.listCourseInfos(context.username);
      },
      courseContent: (_, args) => {
         return service.getCourseContent(args.course);
      }
   },
   Mutation: {
      addStudent: addStudent,
      createCourse(_, args: MutationCreateCourseArgs, context: FliptedContext) {
         if (context.userRole == RoleInternal.Instructor) {
            return service.addCourse(args.course, context.username, context.name);
         }
         throw new ForbiddenError(notInstructorErrorMessage);
      }
   }
};

export default resolvers;
