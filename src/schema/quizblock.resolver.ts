import { FRQuestionInput, MCQuestionInput, QuizBlockInput } from "../interfaces/quizblock";
import quizblockService from "../services/quizblock";

async function addQuizBlock(_: any, args: any, context: any) {
   const quizblock: QuizBlockInput = args.quizblock;
   return quizblockService.addQuizBlock(quizblock);
}

async function addMCQuestionToQuizBlock(_: any, args: any, context: any) {
   const question: MCQuestionInput = args.question;
   return quizblockService.addMCQuestionToQuizBlock(question);
}

async function addFRQuestionToQuizBlock(_: any, args: any, context: any) {
   const question: FRQuestionInput = args.question;
   return quizblockService.addFRQuestionToQuizBlock(question);
}

async function listQuestionsByBlockId(_: any, args: any, context: any) {
   const blockId: string = args.blockId;
   return quizblockService.listQuestionsByBlockId(blockId);
}

function resolveQuestionType(question: any, context: any, info: any) {
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
      quizblock: listQuestionsByBlockId
   },
   Mutation: {
      addQuizBlock,
      addMCQuestionToQuizBlock,
      addFRQuestionToQuizBlock
   }
};

export default resolvers;
