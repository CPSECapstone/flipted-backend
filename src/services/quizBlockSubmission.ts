
import { TABLE_NAME } from "../environment";

import dynamodb, { PutCompositeParams } from "./dynamodb";

const TASK_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");

async function submitMCQuestion(username: string, taskId: string, quizBlockId: string, questionId: string, pointsAwarded: number) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: {
         pk: "MC_SUBMISSION#" + username,
         sk: questionId,
         taskId: taskId,
         quizBlockId: quizBlockId,
         pointsAwarded: pointsAwarded
      }
   };
   return dynamodb.putComposite(params);
}

async function submitFRQuestion(username: string, taskId: string, quizBlockId: string, questionId: string, answer: string) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: {
         pk: "FR_SUBMISSION#" + username,
         sk: questionId,
         taskId: taskId,
         quizBlockId: quizBlockId,
         answer: answer
      }
   };
   return dynamodb.putComposite(params);
}

const quizBlockSubmissionService = {
   submitMCQuestion : submitMCQuestion,
   submitFRQuestion: submitFRQuestion
};

export default quizBlockSubmissionService;
