import * as questionService from "../services/question";

async function addFrQuestion(_: any, args: MutationAddFrQuestionArgs) {
   return questionService.addFrQuestion(args.question);
}

async function addMcQuestion(_: any, args: MutationAddMcQuestionArgs) {
   return questionService.addMcQuestion(args.question);
}

async function listQuestionsByIds(_: any, args: QueryQuestionsArgs) {
   return questionService.listByIds(args.questionIds);
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
