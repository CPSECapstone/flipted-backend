import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import dynamodb, { PutCompositeParams, GetCompositeParams } from "./dynamodb";
import { TaskBlockItem, QuizBlockItem } from "../interfaces/taskblock";
import * as questionService from "./question";
import * as helper from "./taskblockHelper";

async function addTaskBlock(taskblockItem: TaskBlockItem) {
   const params: PutCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
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
   const dbItem = helper.textblockInputToDBItem(textblock);
   return addTaskBlock(dbItem);
}

async function addImageBlock(imageblock: ImageBlockInput) {
   const dbItem = helper.imageblockInputToDBItem(imageblock);
   return addTaskBlock(dbItem);
}

async function addVideoBlock(videoblock: VideoBlockInput) {
   const dbItem = helper.videoblockInputToDBItem(videoblock);
   return addTaskBlock(dbItem);
}

async function addQuizBlock(quizblock: QuizBlockInput) {
   const dbItem = helper.quizblockInputToDBItem(quizblock);
   return addTaskBlock(dbItem);
}

async function getQuizBlockById(taskId: string, blockId: string): Promise<QuizBlock> {
   const params: GetCompositeParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      key: {
         PK: `TASK#${taskId}`,
         SK: `QUIZ_BLOCK#${blockId}`
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
            blockIndex: quizblockItem.blockIndex,
            pageIndex: quizblockItem.pageIndex,
            requiredScore: quizblockItem.requiredScore,
            questions: questions
         };
      }
      throw new Error(`QuizBlock not found with blockId=${blockId} within taskId=${taskId}`);
   } catch (err) {
      console.log("Errored like it should in getQuizBlockById");
      throw err;
   }
}

const quizblockService = {
   addTextBlock,
   addImageBlock,
   addVideoBlock,
   addQuizBlock,
   getQuizBlockById
};

export default quizblockService;
