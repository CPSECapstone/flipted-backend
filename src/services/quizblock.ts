import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TABLE_NAME } from "../environment";
import { QuizBlockInput, QuizBlock } from "../interfaces/quizblock";
import dynamodb, { PutCompositeParams, GetCompositeParams } from "./dynamodb";
import questionService from "./question";
import { quizblockInputToDBItem, QuizBlockItem } from "./quizblockHelper";

const QUIZBLOCKS_TABLE = TABLE_NAME("QuizBlocks");

async function addQuizBlock(quizblock: QuizBlockInput) {
   const dbItem = quizblockInputToDBItem(quizblock);
   const params: PutCompositeParams = {
      tableName: QUIZBLOCKS_TABLE,
      item: dbItem
   };

   try {
      const output = await dynamodb.putComposite(params);
      return dbItem.PK;
   } catch (err) {
      return err;
   }
}

async function getQuizBlockById(blockId: string): Promise<QuizBlock> {
   const params: GetCompositeParams = {
      tableName: QUIZBLOCKS_TABLE,
      key: {
         PK: `QUIZ_BLOCK#${blockId}`,
         SK: `QUIZ_BLOCK#${blockId}`
      }
   };

   try {
      const output = await dynamodb.getComposite(params);
      if (output.Item) {
         const quizblockItem = <QuizBlockItem>unmarshall(output.Item);
         const questions = await questionService.listByIds(quizblockItem.questionIds);
         return <QuizBlock>{
            id: quizblockItem.blockId,
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
   addQuizBlock,
   getQuizBlockById
};

export default quizblockService;
