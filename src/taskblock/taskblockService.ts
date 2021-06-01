import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import dynamodb from "../services/dynamodb";
import { TaskBlockItem, QuizBlockItem } from "../taskblock/taskblockInterface";
import * as questionService from "../services/question";
import * as helper from "./taskblockHelper";

export async function addTaskBlock(taskblockItem: TaskBlockItem) {
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

export async function addTextBlock(textblock: TextBlockInput) {
   const dbItem = helper.textblockInputToDBItem(textblock);
   return addTaskBlock(dbItem);
}

export async function addImageBlock(imageblock: ImageBlockInput) {
   const dbItem = helper.imageblockInputToDBItem(imageblock);
   return addTaskBlock(dbItem);
}

export async function addVideoBlock(videoblock: VideoBlockInput) {
   const dbItem = helper.videoblockInputToDBItem(videoblock);
   return addTaskBlock(dbItem);
}

export async function addQuizBlock(quizblock: QuizBlockInput) {
   const dbItem = helper.quizblockInputToDBItem(quizblock);
   return addTaskBlock(dbItem);
}

export async function addFrBlock(frblock: FrBlockInput) {
   const dbItem = helper.frBlockInputToDBItem(frblock);
   return addTaskBlock(dbItem);
}

export async function addMcBlock(mcblock: McBlockInput) {
   const dbItem = helper.mcBlockInputToDBItem(mcblock);
   return addTaskBlock(dbItem);
}

export async function listTaskBlocks(): Promise<TaskBlock[]> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "contains(SK, :skPartial)",
      expressionAttributeValues: {
         ":skPartial": "_BLOCK"
      }
   };

   try {
      const output = await dynamodb.scan(params);
      const blocks: TaskBlock[] = helper.dbItemsToTaskBlocks(output.Items || []);
      return blocks;
   } catch (err) {
      return err;
   }
}

export async function getQuizBlockById(taskId: string, blockId: string): Promise<QuizBlock> {
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

export async function importItems(blockItems: TaskBlockItem[]): Promise<number> {
   blockItems.forEach(blockItem => {
      blockItem.source = "imported";
   });

   const params: BatchWriteParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      items: blockItems
   };

   try {
      return dynamodb.batchWrite(params);
   } catch (err) {
      return err;
   }
}

export async function deleteItems(): Promise<number> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "contains(SK, :skPartial) and equals(source, :sourceVal)",
      expressionAttributeValues: {
         ":skPartial": "_BLOCK",
         ":sourceVal": "imported"
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}
