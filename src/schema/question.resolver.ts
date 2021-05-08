import * as questionService from "../services/question";
import { RoleInternal } from "../interfaces/role";
import { validateToken } from "../jws-verifer";
import userService from "../services/user";

async function addFrQuestion(_: any, args: MutationAddFrQuestionArgs) {
   return questionService.addFrQuestion(args.question);
}

async function addMcQuestion(_: any, args: MutationAddMcQuestionArgs) {
   return questionService.addMcQuestion(args.question);
}

async function listQuestionsByIds(_: any, args: QueryQuestionsArgs, context: any) {
   const questionIds: string[] = args.questionIds;
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username); // then get the user role

   return questionService.listByIds(questionIds, userRole == RoleInternal.Instructor);
}

async function resolveQuestionType(question: any, context: any, info: any) {
   return questionService.resolveQuestionType(question);
}

const resolvers = {
   Query: {
      questions: listQuestionsByIds
   },
   Mutation: {
      addFrQuestion,
      addMcQuestion
   },
   Question: {
      __resolveType: resolveQuestionType
   }
};

export default resolvers;
