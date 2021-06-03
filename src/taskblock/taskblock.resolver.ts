import { Resolvers } from "../__generated__/resolvers";
import * as service from "./taskblockService";

const resolvers: Resolvers = {
   Query: {
      quizblock: (_, args) => {
         return service.getQuizBlockById(args.taskId, args.blockId);
      }
   },
   Mutation: {
      addTextBlock: (_, args) => {
         return service.addTextBlock(args.textblock);
      },
      addImageBlock: (_, args) => {
         return service.addImageBlock(args.imageblock);
      },
      addVideoBlock: (_, args) => {
         return service.addVideoBlock(args.videoblock);
      },
      addQuizBlock: (_, args) => {
         return service.addQuizBlock(args.quizblock);
      },
      addFrBlock: (_, args) => {
         return service.addFrBlock(args.frBlock);
      },
      addMcBlock: (_, args) => {
         return service.addMcBlock(args.mcBlock);
      }
   }
};

export default resolvers;
