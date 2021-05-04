import { RoleInternal } from "../interfaces/role";
import { validateToken } from "../jws-verifer";
import questionService from "../services/question";
import userService from "../services/user";

async function addFrQuestion(_: any, args: any, context: any, info: any) {
   const question: FrQuestionInput = args.question;
   return questionService.addFrQuestion(question);
}

async function addMcQuestion(_: any, args: any, context: any, info: any) {
   const question: McQuestionInput = args.question;
   return questionService.addMcQuestion(question);
}

async function listQuestionsByIds(_: any, args: any, context: any) {
   const questionIds: string[] = args.questionIds;
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username); // then get the user role

   return questionService.listByIds(questionIds, userRole == RoleInternal.Instructor)
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
