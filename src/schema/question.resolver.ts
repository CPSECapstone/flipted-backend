import { FRQuestionInput, MCQuestionInput } from "../interfaces/question";
import questionService from "../services/question";

async function addFRQuestion(_: any, args: any, context: any, info: any) {
   const question: FRQuestionInput = args.question;
   return questionService.addFRQuestion(question);
}

async function addMCQuestion(_: any, args: any, context: any, info: any) {
   const question: MCQuestionInput = args.question;
   return questionService.addMCQuestion(question);
}

async function listQuestionsByIds(_: any, args: any, context: any) {
   const questionIds: string[] = args.questionIds;
   return questionService.listByIds(questionIds);
}

async function resolveQuestionType(question: any, context: any, info: any){
   return questionService.resolveQuestionType(question);
}

const resolvers = {
   Query: {
      questions: listQuestionsByIds
   },
   Mutation: {
      addFRQuestion,
      addMCQuestion
   },
   Question: {
      __resolveType: resolveQuestionType
   }
};

export default resolvers;
