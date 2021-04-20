import { unmarshall } from "@aws-sdk/util-dynamodb";

import { TABLE_NAME } from "../environment";
import {
   FRQuestionInput,
   MCQuestionInput,
   Question,
   QuizBlock,
   QuizBlockInput
} from "../interfaces/quizblock";
import dynamodb, {
   BatchGetParams,
   BatchWriteParams,
   PutCompositeParams,
   QueryParams
} from "./dynamodb";

import * as helper from "./quizblockHelper";

const QUIZBLOCK_TABLE = TABLE_NAME("QuizBlocks");

async function addQuizBlock(quizblock: QuizBlockInput) {
   const dbItem = helper.quizblockInputToDBItem(quizblock);
   const params: PutCompositeParams = {
      tableName: QUIZBLOCK_TABLE,
      item: dbItem
   };

   try {
      const output = await dynamodb.putComposite(params);
      return dbItem.PK;
   } catch (err) {
      return err;
   }
}

async function addMCQuestionToQuizBlock(question: MCQuestionInput) {
   const dbItems = helper.mcQuestionInputToDBItems(question);
   const params: BatchWriteParams = {
      tableName: QUIZBLOCK_TABLE,
      items: dbItems
   };

   try {
      const output = await dynamodb.batchWrite(params);
      if (output.ConsumedCapacity && output.ConsumedCapacity[0].CapacityUnits) {
         return output.ConsumedCapacity[0].CapacityUnits;
      }

      return 0;
   } catch (err) {
      return err;
   }
}

async function addFRQuestionToQuizBlock(question: FRQuestionInput) {
   const dbItems = helper.frQuestionInputToDBItems(question);
   const params: BatchWriteParams = {
      tableName: QUIZBLOCK_TABLE,
      items: dbItems
   };

   try {
      const output = await dynamodb.batchWrite(params);
      if (output.ConsumedCapacity && output.ConsumedCapacity[0].CapacityUnits) {
         return output.ConsumedCapacity[0].CapacityUnits;
      }

      return 0;
   } catch (err) {
      return err;
   }
}

async function listQuestionsByBlockId(blockId: string): Promise<Question[]> {
   const params: QueryParams = {
      tableName: QUIZBLOCK_TABLE,
      keyConditionExpression: "PK = :blockId",
      expressionAttributeValues: {
         ":blockId": `QUIZ_BLOCK#${blockId}`
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const questionIds = output.Items.map((item: any) => {
            return item.SK;
         });
         const questions = await listByIds(questionIds);
         return questions;
      }
      throw new Error(`QuizBlock not found with blockId=${blockId}`);
   } catch (err) {
      return err;
   }
}

async function listByIds(questionIds: string[], withAnswer: boolean = false): Promise<Question[]> {
   let projection = withAnswer
      ? "id, description, options, points"
      : "id, description, options, points, answers";
   const params: BatchGetParams = {
      tableName: QUIZBLOCK_TABLE,
      keyName: "id",
      keyValues: questionIds,
      projectionExpression: projection //answers
   };

   try {
      const output = await dynamodb.batchGet(params);
      if (output.Responses) {
         const questions = output.Responses[QUIZBLOCK_TABLE];
         return questions.map((item: any) => {
            return <Question>unmarshall(item);
         });
      }

      return [];
   } catch (err) {
      return err;
   }
}

const questionService = {
   addQuizBlock,
   addMCQuestionToQuizBlock,
   addFRQuestionToQuizBlock,
   listQuestionsByBlockId
};

export default questionService;
