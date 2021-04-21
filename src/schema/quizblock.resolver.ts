import { QuizBlockInput } from "../interfaces/quizblock";
import quizblockService from "../services/quizblock";

async function addQuizBlock(_: any, args: any, context: any) {
   const quizblock: QuizBlockInput = args.quizblock;
   return quizblockService.addQuizBlock(quizblock);
}

async function getQuizBlockById(_: any, args: any, context: any) {
   const blockId: string = args.blockId;
   return quizblockService.getQuizBlockById(blockId);
}

async function resolveQuestionType(question: any, context: any, info: any) {
   if (question.answers) {
      return "MCQuestion";
   }
   if (question.answer) {
      return "FRQuestion";
   }
   return null;
}

const resolvers = {
   Question: {
      __resolveType: resolveQuestionType
   },
   Query: {
      quizblock: getQuizBlockById
   },
   Mutation: {
      addQuizBlock
   }
};

export default resolvers;
