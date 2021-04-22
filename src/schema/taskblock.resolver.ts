import taskblockService from "../services/taskblock";
import {
   QuizBlockInput,
   TextBlockInput,
   ImageBlockInput,
   VideoBlockInput
} from "../interfaces/taskblock";

async function addTextBlock(_: any, args: any, context: any) {
   const textblock: TextBlockInput = args.textblock;
   return taskblockService.addTextBlock(textblock);
}

async function addImageBlock(_: any, args: any, context: any) {
   const imageblock: ImageBlockInput = args.imageblock;
   return taskblockService.addImageBlock(imageblock);
}

async function addVideoBlock(_: any, args: any, context: any) {
   const videoblock: VideoBlockInput = args.videoblock;
   return taskblockService.addVideoBlock(videoblock);
}

async function addQuizBlock(_: any, args: any, context: any) {
   const quizblock: QuizBlockInput = args.quizblock;
   return taskblockService.addQuizBlock(quizblock);
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
   Mutation: {
      addTextBlock,
      addImageBlock,
      addVideoBlock,
      addQuizBlock
   }
};

export default resolvers;
