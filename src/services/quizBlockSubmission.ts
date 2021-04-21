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

async function submitMCQuestion(username: string, taskId: string, question: MCQuestion, pointsAwarded: number) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: {
         pk: "MC_SUBMISSION#" + username,
         sk: "QUESTION#" +question.id,
         taskId: taskId,
         pointsAwarded: pointsAwarded
      }
   };
   return dynamodb.putComposite(params);
}

const quizBlockSubmissionService = {
   submitMCQuestion : submitMCQuestion
};

export default quizBlockSubmissionService;
