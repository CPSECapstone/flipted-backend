import questionService from "../services/question";

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
   return questionService.listByIds(questionIds);
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
