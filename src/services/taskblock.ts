import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TABLE_NAME } from "../environment";
import dynamodb, { PutCompositeParams, GetCompositeParams } from "./dynamodb";
import questionService from "./question";
import {
   TextBlockInput,
   ImageBlockInput,
   VideoBlockInput,
   QuizBlockInput,
   QuizBlock,
   TaskBlockItem,
   QuizBlockItem
} from "../interfaces/taskblock";
import {
   imageblockInputToDBItem,
   quizblockInputToDBItem,
   textblockInputToDBItem,
   videoblockInputToDBItem
} from "./taskblockHelper";

const QUIZBLOCKS_TABLE = TABLE_NAME("QuizBlocks");

async function addTaskBlock(taskblockItem: TaskBlockItem) {
   const params: PutCompositeParams = {
      tableName: QUIZBLOCKS_TABLE,
      item: taskblockItem
   };

   try {
      const output = await dynamodb.putComposite(params);
      return taskblockItem.SK;
   } catch (err) {
      return err;
   }
}

async function addTextBlock(textblock: TextBlockInput) {
   const dbItem = textblockInputToDBItem(textblock);
   return addTaskBlock(dbItem);
}

async function addImageBlock(imageblock: ImageBlockInput) {
   const dbItem = imageblockInputToDBItem(imageblock);
   return addTaskBlock(dbItem);
}

async function addVideoBlock(videoblock: VideoBlockInput) {
   const dbItem = videoblockInputToDBItem(videoblock);
   return addTaskBlock(dbItem);
}

async function addQuizBlock(quizblock: QuizBlockInput) {
   const dbItem = quizblockInputToDBItem(quizblock);
   return addTaskBlock(dbItem);
}

async function getQuizBlockById(blockId: string): Promise<QuizBlock> {
   
   const params: GetCompositeParams = {
      tableName: QUIZBLOCKS_TABLE,
      key: {
         PK: blockId,
         SK: blockId,
      }
   };

   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const quizblockItem = <QuizBlockItem>unmarshall(output.Item);
         const questions = await questionService.listByIds(quizblockItem.questionIds);
         return <QuizBlock>{
            blockId,
            title: quizblockItem.title,
            points: quizblockItem.points,
            requiredScore: quizblockItem.requiredScore,
            questions
         };
      }
      throw new Error(`QuizBlock not found with blockId=${blockId}`);
   } catch (err) {
      return err;
   }
}

const quizblockService = {
   addTextBlock,
   addImageBlock,
   addVideoBlock,
   addQuizBlock,
   getQuizBlockById,
};

export default quizblockService;