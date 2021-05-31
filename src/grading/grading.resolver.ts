import { ForbiddenError } from "apollo-server-lambda";
import { RoleInternal } from "../interfaces/role";
import { Resolvers } from "../__generated__/resolvers";
import * as gradingService from "../grading/grading.service";

async function gradeTaskSubmission(
   _: any,
   args: MutationGradeTaskSubmissionArgs,
   context: FliptedContext,
   info: any
) {
   if (context.userRole == RoleInternal.Instructor) {
      const attributes = await gradingService.updateTaskGrade(args.grade);
      return {
         taskId: args.grade.taskId,
         student: args.grade.student,
         ...attributes
      } as TaskSubmissionGrade;
   }

   throw new ForbiddenError(`User ${context.username} is not an authorized instructor.`);
}

async function gradeAnswer(
   _: any,
   args: MutationGradeAnswerArgs,
   context: FliptedContext,
   info: any
) {
   if (context.userRole == RoleInternal.Instructor) {
      const attributes = await gradingService.updateAnswerGrade(args.grade);
      return {
         questionId: args.grade.questionId,
         student: args.grade.student,
         ...attributes
      } as AnswerGrade;
   }

   throw new ForbiddenError(`User ${context.username} is not an authorized instructor.`);
}

async function gradeObjectiveTaskMastery(
   _: any,
   args: MutationGradeObjectiveTaskMasteryArgs,
   context: FliptedContext,
   info: any
) {
   if (context.userRole == RoleInternal.Instructor) {
      await gradingService.updateMastery(args.grade);
      return args.grade as ObjectiveTaskMastery
   }

   throw new ForbiddenError(`User ${context.username} is not an authorized instructor.`);
}

const resolvers: Resolvers = {
   Mutation: {
      gradeTaskSubmission: gradeTaskSubmission,
      gradeAnswer: gradeAnswer,
      gradeObjectiveTaskMastery: gradeObjectiveTaskMastery
   }
};

export default resolvers;
