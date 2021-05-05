import { TABLE_NAME } from "../environment";
import dynamodb, { BatchGetParams, GetParams, PutParams } from "./dynamodb";
import { QuestionItem } from "../interfaces/question";
import * as helper from "./questionHelper";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const QUESTIONS_TABLE = TABLE_NAME("Questions");

export async function addQuestion(dbItem: QuestionItem) {
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
export async function addFrQuestion(question: FrQuestionInput) {
   const dbItem = helper.frQuestionInputToDBItem(question);
   return addQuestion(dbItem);
}

// add multiple choice question to question bank
export async function addMcQuestion(question: McQuestionInput) {
   const dbItem = helper.mcQuestionInputToDBItem(question);
   return addQuestion(dbItem);
}

export async function getById(
   questionId: string,
   prefix: string,
   withAnswer: boolean = false
): Promise<Question> {
   const params: GetParams = {
      tableName: QUESTIONS_TABLE,
      key: prefix + questionId
   };

   const output = await dynamodb.get(params);
   if (output.Item) {
      const question = <Question>unmarshall(output.Item);
      return question;
   }

   throw new Error(`Question not found with id=${questionId}`);
}

export async function listByIds(
   questionIds: string[],
   withAnswer: boolean = false
): Promise<Question[]> {
   const params: BatchGetParams = {
      tableName: QUESTIONS_TABLE,
      keyName: "id",
      keyValues: questionIds
   };

   try {
      const output = await dynamodb.batchGet(params);
      if (output.Responses) {
         const questions = helper.dbResponsesToQuestions(output.Responses[QUESTIONS_TABLE]);
         return questions;
      }

      return [];
   } catch (err) {
      return err;
   }
}

export function resolveQuestionType(question: any) {
   if (!question.id) return null;
   const [type, id] = question.id.split("#");
   if (type == "MC_QUESTION") return "McQuestion";
   if (type == "FR_QUESTION") return "FrQuestion";

   return null;
}
