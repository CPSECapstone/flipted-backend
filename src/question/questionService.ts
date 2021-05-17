import { QUESTIONS_TABLE } from "../environment";
import dynamodb, {
   BatchGetParams,
   BatchWriteParams,
   GetParams,
   PutParams,
   ScanParams
} from "../services/dynamodb";
import { FrQuestionPrefix, McQuestionPrefix, QuestionItem } from "./questionInterface";
import * as helper from "./questionHelper";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { BatchWriteItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbItemToFreeResponseAnswer } from "../submissions/taskSubmissionHelper";

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
   const keys = questionIds.map(questionId => {
      return { id: questionId };
   });

   const params: BatchGetParams = {
      tableName: QUESTIONS_TABLE,
      keys
   };

   try {
      const output = await dynamodb.batchGet(params);
      if (output.Responses) {
         const questions = helper.dbResponsesToQuestions(
            output.Responses[QUESTIONS_TABLE],
            withAnswer
         );
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

export async function batchWriteFrQuestions(questions: FrQuestionInput[]): Promise<number> {
   const items = questions.map(helper.frQuestionInputToDBItem);
   const params: BatchWriteParams = {
      tableName: QUESTIONS_TABLE,
      items
   };

   try {
      const output = await dynamodb.batchWrite(params);
      if (output.ConsumedCapacity) {
         console.log(output.ConsumedCapacity);
         return output.ConsumedCapacity.length;
      }

      return 0;
   } catch (err) {
      return err;
   }
}

export async function listFrQuestions(): Promise<FrQuestion[]> {
   const params: ScanParams = {
      tableName: QUESTIONS_TABLE,
      filterExpression: "begins_with(id, :idPrefix)",
      expressionAttributeValues: {
         ":idPrefix": FrQuestionPrefix
      },
      limit: 50
   };

   try {
      const output = await dynamodb.scan(params);
      if (output.Items) {
         const questions = output.Items.map(rawItem => {
            const item = unmarshall(rawItem);
            return <FrQuestion>{
               id: item.id,
               description: item.description,
               points: item.points,
               answer: item.answer
            };
         });

         return questions;
      }

      return [];
   } catch (err) {
      return err;
   }
}

export async function batchWriteMcQuestions(questions: McQuestionInput[]): Promise<number> {
   const items = questions.map(helper.mcQuestionInputToDBItem);
   const params: BatchWriteParams = {
      tableName: QUESTIONS_TABLE,
      items
   };

   try {
      const output = await dynamodb.batchWrite(params);
      console.log(output);
      if (output.ConsumedCapacity) {
         console.log(output.ConsumedCapacity);
         return output.ConsumedCapacity.length;
      }

      return 0;
   } catch (err) {
      return err;
   }
}

export async function listMcQuestions(): Promise<McQuestion[]> {
   const params: ScanParams = {
      tableName: QUESTIONS_TABLE,
      filterExpression: "begins_with(id, :idPrefix)",
      expressionAttributeValues: {
         ":idPrefix": McQuestionPrefix
      },
      limit: 50
   };

   try {
      const output = await dynamodb.scan(params);
      if (output.Items) {
         const questions = output.Items.map(rawItem => {
            const item = unmarshall(rawItem);
            return <McQuestion>{
               id: item.id,
               description: item.description,
               points: item.points,
               options: item.options,
               answers: item.answers
            };
         });

         return questions;
      }

      return [];
   } catch (err) {
      return err;
   }
}
