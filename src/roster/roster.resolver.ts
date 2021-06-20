import { ForbiddenError } from "apollo-server-lambda";
import { notInstructorErrorMessage } from "../environment";
import { RoleInternal } from "../interfaces/role";
import * as service from "./rosterService";

async function addStudent(_: any, args: MutationAddStudentArgs) {
   return service.addStudent(args.student);
}

async function getStudent(_: any, args: QueryStudentArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor) {
      if(!args.studentId) {
         throw new Error("Instructor did not provide a student to query")
      }
      return service.getStudent(args.course, args.studentId);
   }
   return service.getStudent(args.course, context.username);
}

async function listStudentsByCourse(_: any, args: QueryStudentsArgs, context: FliptedContext) {
   if (context.userRole == RoleInternal.Instructor) {
      return service.listStudentsByCourse(args.course);
   }
   throw new ForbiddenError(notInstructorErrorMessage)
}

const resolvers = {
   Query: {
      student: getStudent,
      students: listStudentsByCourse
   },
   Mutation: {
      addStudent
   }
};

export default resolvers;
