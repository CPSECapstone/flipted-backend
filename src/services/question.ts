import { TABLE_NAME } from "../environment";
import dynamodb, { BatchGetParams, PutParams } from "./dynamodb";
import { FRQuestionInput, MCQuestionInput, Question, QuestionItem } from "../interfaces/question";

import {
   dbResponsesToQuestions,
   frQuestionInputToDBItem,
   mcQuestionInputToDBItem
} from "./questionHelper";

const QUESTIONS_TABLE = TABLE_NAME("Questions");

async function addQuestion(dbItem: QuestionItem) {
   const params: PutParams = {
      tableName: QUESTIONS_TABLE,
      item: dbItem
   };

   try {
      const output = await dynamodb.put(params);
      return dbItem.id;
   } catch (err) {
      return err;
   }
}

// add free response question to question bank
async function addFRQuestion(question: FRQuestionInput) {
   const dbItem = frQuestionInputToDBItem(question);
   return addQuestion(dbItem);
}

// add multiple choice question to question bank
async function addMCQuestion(question: MCQuestionInput) {
   const dbItem = mcQuestionInputToDBItem(question);
   return addQuestion(dbItem);
}

async function listByIds(questionIds: string[], withAnswer: boolean = false): Promise<Question[]> {
   const params: BatchGetParams = {
      tableName: QUESTIONS_TABLE,
      keyName: "id",
      keyValues: questionIds
   };

   try {
      const output = await dynamodb.batchGet(params);
      if (output.Responses) {
         const questions = dbResponsesToQuestions(output.Responses[QUESTIONS_TABLE]);
         return questions;
      }

      return [];
   } catch (err) {
      return err;
   }
}

const questionService = {
   addFRQuestion,
   addMCQuestion,
   listByIds
};

export default questionService;
