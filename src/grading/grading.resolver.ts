import { ForbiddenError } from "apollo-server-lambda";
import { RoleInternal } from "../interfaces/role";
import { Resolvers } from "../__generated__/resolvers";
import * as gradingService from "../grading/grading.service"

async function gradeTaskSubmission(_: any, args: MutationGradeTaskSubmissionArgs, context: FliptedContext, info: any) {
  if(context.userRole == RoleInternal.Instructor) {
     const attributes = await gradingService.updateTaskGrade(args.grade)
     console.log(attributes)
     return {
        student: args.grade.student,
        taskId: args.grade.taskId,
        ...attributes
     } as TaskSubmissionGrade
  }

  throw new ForbiddenError(`User ${context.username} is not an authorized instructor.`)
}

async function gradeAnswer(_: any, args: any, context: any, info: any) {
  return <AnswerGrade>{}
}

const resolvers: Resolvers = {
   Mutation: {
      gradeTaskSubmission: gradeTaskSubmission,
      gradeAnswer: gradeAnswer
   }
};

export default resolvers;
