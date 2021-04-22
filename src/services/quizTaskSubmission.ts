import { unmarshall } from "@aws-sdk/util-dynamodb";

import { TABLE_NAME } from "../environment";
import {
   QuizTaskSubmission,
   QuizTaskSubmissionInput,
   QuizTaskSubmissionSummary,
   StudentAnswerInput,
   StudentAnswerResult
} from "../interfaces";

import taskblockService from "./taskblock";
import taskService from "./task";
import dynamodb, { GetParams, PutParams, ScanParams } from "./dynamodb";
import { Question } from "../interfaces/question";

const TASK_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");

function computeResult(questions: Question[], answers: StudentAnswerInput[]) {
   let map: Map<string, Question> = new Map();
   questions.forEach((question: Question) => {
      map.set(question.id, question);
   });

   let results: StudentAnswerResult[] = [];

   // grade student's quizblock submission
   // todo

   return results;
}

async function add(submission: QuizTaskSubmissionInput) {
   try {
      const quizblock = await taskblockService.getQuizBlockById(submission.taskId);
      const questions = quizblock.questions;
      const results = computeResult(questions, submission.answers);
      const points = results.reduce((acc, curr) => acc + curr.points, 0);

      const params: PutParams = {
         tableName: TASK_SUBMISSIONS_TABLE,
         item: {
            student: submission.student,
            taskId: submission.taskId,
            results,
            points
         }
      };

      return dynamodb.put(params);
   } catch (err) {
      console.log(err);
      return err;
   }
}

async function getById(submissionId: string) {
   const params: GetParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      key: submissionId
   };

   try {
      const output = await dynamodb.get(params);
      if (!output.Item) {
         throw new Error(`Submission not found with id=${submissionId}`);
      }

      const submission = <QuizTaskSubmissionSummary>unmarshall(output.Item);
      const taskId = submission.taskId;
      const task = await taskService.getTaskById(submission.taskId);

      return { task, submission };
   } catch (err) {
      return err;
   }
}

async function listByTaskId(taskId: string): Promise<QuizTaskSubmission[]> {
   const param: ScanParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      filterExpression: "taskId = :taskId",
      expressionAttributeValues: {
         ":taskId": taskId
      }
   };

   try {
      const output = await dynamodb.scan(param);
      if (!output.Items) {
         return [];
      }
      const submissions = output.Items.map((item: any) => {
         return <QuizTaskSubmission>unmarshall(item);
      });
      return submissions;
   } catch (err) {
      return err;
   }
}

/*
  quiz task submission in submit
*/
const quizTaskSubmissionService = {
   add,
   getById,
   listByTaskId
};

export default quizTaskSubmissionService;
