import * as service from "./rosterService";

async function addStudent(_: any, args: MutationAddStudentArgs) {
   return service.addStudent(args.student);
}

async function getStudent(_: any, args: QueryStudentArgs) {
   return service.getStudent(args.course, args.studentId);
}

async function listStudentsByCourse(_: any, args: QueryStudentsArgs) {
   return service.listStudentsByCourse(args.course);
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
