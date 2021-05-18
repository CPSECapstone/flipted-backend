import * as service from "./taskblockService";

async function addTextBlock(_: any, args: MutationAddTextBlockArgs) {
   const textblock: TextBlockInput = args.textblock;
   return service.addTextBlock(textblock);
}

async function addImageBlock(_: any, args: MutationAddImageBlockArgs) {
   const imageblock: ImageBlockInput = args.imageblock;
   return service.addImageBlock(imageblock);
}

async function addVideoBlock(_: any, args: MutationAddVideoBlockArgs) {
   const videoblock: VideoBlockInput = args.videoblock;
   return service.addVideoBlock(videoblock);
}

async function addQuizBlock(_: any, args: MutationAddQuizBlockArgs) {
   const quizblock: QuizBlockInput = args.quizblock;
   return service.addQuizBlock(quizblock);
}

async function addFrBlock(_: any, args: MutationAddFrBlockArgs) {
   const frBlock: FrBlockInput = args.frBlock;
   return service.addFrBlock(frBlock);
}

async function addMcBlock(_: any, args: MutationAddMcBlockArgs) {
   const mcBlock: McBlockInput = args.mcBlock;
   return service.addMcBlock(mcBlock);
}

async function getQuizBlockById(_: any, args: any) {
   return service.getQuizBlockById(args.taskId, args.blockId);
}

const resolvers = {
   Query: {
      quizblock: getQuizBlockById
   },
   Mutation: {
      addTextBlock,
      addImageBlock,
      addVideoBlock,
      addQuizBlock,
      addFrBlock,
      addMcBlock
   }
};

export default resolvers;
