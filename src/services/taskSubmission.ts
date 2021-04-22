
import { TABLE_NAME } from "../environment";
import { TaskProgressItem } from "../interfaces/taskSubmission";

import dynamodb, { PutCompositeParams } from "./dynamodb";

const TASK_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");

async function submitTaskProgress(taskProgress: TaskProgressItem) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: taskProgress
   };
   return dynamodb.putComposite(params);
}

async function submitMCQuestion(username: string, taskId: string, quizBlockId: string, questionId: string, pointsAwarded: number) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: {
         PK: "MC_SUBMISSION#" + username,
         SK: questionId,
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
         PK: "FR_SUBMISSION#" + username,
         SK: questionId,
         taskId: taskId,
         quizBlockId: quizBlockId,
         answer: answer
      }
   };
   return dynamodb.putComposite(params);
}

const taskSubmissionService = {
   submitMCQuestion : submitMCQuestion,
   submitFRQuestion: submitFRQuestion,
   submitTaskProgress
};

export default taskSubmissionService;
