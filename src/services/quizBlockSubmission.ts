import { unmarshall } from "@aws-sdk/util-dynamodb";

import { TABLE_NAME } from "../environment";
import {
   QuizTaskSubmission,
   QuizTaskSubmissionInput,
   QuizTaskSubmissionSummary,
   StudentAnswerInput,
   StudentAnswerResult
} from "../interfaces";

import quizblockService from "./quizblock";
import questionService from "./question";
import taskService from "./task";
import dynamodb, { GetParams, PutCompositeParams, PutParams, ScanParams } from "./dynamodb";
import { QuizBlock } from "../interfaces/quizblock";
import { MCQuestion, Question } from "../interfaces/question";

const TASK_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");

async function submitMCQuestion(username: string, taskId: string, quizBlockId: string, questionId: string, pointsAwarded: number) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: {
         pk: "MC_SUBMISSION#" + username,
         sk: "MC_QUESTION#" + questionId,
         taskId: "TASK#" + taskId,
         quizBlockId: quizBlockId,
         pointsAwarded: pointsAwarded
      }
   };
   return dynamodb.putComposite(params);
}

async function submitFRQuestion(username: string, taskId: string, quizBlockId: string, questionId: string, pointsAwarded: number) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: {
         pk: "FR_SUBMISSION#" + username,
         sk: "FR_QUESTION#" + questionId,
         taskId: "TASK#" + taskId,
         quizBlockId: quizBlockId,
         pointsAwarded: pointsAwarded
      }
   };
   return dynamodb.putComposite(params);
}

const quizBlockSubmissionService = {
   submitMCQuestion : submitMCQuestion,
   submitFRQuestion: submitFRQuestion
};

export default quizBlockSubmissionService;
