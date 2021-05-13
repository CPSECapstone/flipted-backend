import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TASK_SUBMISSIONS_TABLE } from "../environment";
import {
   Answer,
   QuestionAnswerItem,
   TaskProgressItem,
   TaskSubmissionResult,
   TaskSubmissionResultItem
} from "../interfaces/taskSubmission";

import dynamodb, { GetCompositeParams, PutCompositeParams, QueryParams } from "./dynamodb";
import {
   dbItemsToQuestionAnswerItems,
   dbItemToTaskProgress,
   dbItemToTaskSubmissionResult,
   taskSubResultToDBItem
} from "./taskSubmissionHelper";

async function submitTaskProgress(taskProgress: TaskProgressItem) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: taskProgress
   };

   try {
      return dynamodb.putComposite(params);
   } catch (err) {
      return err;
   }
}

async function submitQuestionAnswer(answer: QuestionAnswerItem) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: answer
   };
   try {
      return dynamodb.putComposite(params);
   } catch (err) {
      return err;
   }
}

async function getTaskSubmission(username: string, taskId: string) {
   const params: GetCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      key: {
         PK: "TASK_SUBMISSION#" + username,
         SK: taskId
      }
   };

   const output = await dynamodb.getComposite(params);
   if (output.Item) {
      const taskProgress = <TaskSubmissionResultItem>unmarshall(output.Item);
      return dbItemToTaskSubmissionResult(taskProgress);
   }

   throw new Error(`Task Submission not found with id=${taskId}`);
}

async function getTaskRubricProgress(taskId: string, username: string): Promise<TaskProgress> {
   const params: GetCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      key: {
         PK: "TASK_PROGRESS#" + username,
         SK: taskId
      }
   };

   const output = await dynamodb.getComposite(params);
   if (output.Item) {
      const taskProgress = <TaskProgressItem>unmarshall(output.Item);
      return dbItemToTaskProgress(taskProgress);
   }

   throw new Error(`Task Progress not found with id=${taskId}`);
}

async function getQuizProgressForTask(taskId: string, username: string): Promise<Answer[]> {
   const params: QueryParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      keyConditionExpression: "PK = :pkVal",
      filterExpression: "taskId = :taskId",
      expressionAttributeValues: {
         ":pkVal": `QUESTION_ANSWER#${username}`,
         ":taskId": taskId
      }
   };

   const output = await dynamodb.query(params);
   if (output.Items) {
      const questionAnswerItems = output.Items.map((item: any) => {
         return <QuestionAnswerItem>unmarshall(item);
      });

      return dbItemsToQuestionAnswerItems(questionAnswerItems);
   }
   throw new Error(`Task not found with id=${taskId}`);
}

async function submitTaskForGrading(taskResult: TaskSubmissionResult, username: string) {
   const dbItem: TaskSubmissionResultItem = taskSubResultToDBItem(taskResult, username);

   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: dbItem
   };
   try {
      return dynamodb.putComposite(params);
   } catch (err) {
      return err;
   }
}

const taskSubmissionService = {
   submitQuestionAnswer,
   submitTaskProgress,
   submitTaskForGrading,
   getTaskSubmission,
   getQuizProgressForTask,
   getTaskRubricProgress
};

export default taskSubmissionService;
