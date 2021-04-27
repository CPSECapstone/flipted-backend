import taskblockService from "../services/taskblock";

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

const resolvers = {
   Mutation: {
      addTextBlock,
      addImageBlock,
      addVideoBlock,
      addQuizBlock
   }
};

export default resolvers;
