import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TABLE_NAME } from "../environment";
import {
   Answer,
   QuestionAnswerItem,
   TaskProgressItem,
   TaskSubmissionResultItem
} from "./taskSubmissionInterface";

import dynamodb, { GetCompositeParams, PutCompositeParams, QueryParams } from "../services/dynamodb";
import {
   dbItemsToQuestionAnswerItems,
   dbItemToTaskProgress,
   dbItemToTaskSubmissionResult,
   taskSubResultToDBItem
} from "./taskSubmissionHelper";

const TASK_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");

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

async function submitTaskForGrading(task: Task, taskResult: TaskSubmissionResult, username: string) {
   const dbItem: TaskSubmissionResultItem = taskSubResultToDBItem(task.course, task.missionId, taskResult, username);

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

async function listUserSubmissionsByCourse(course: string, username: string): Promise<TaskSubmissionResultItem[]> {
   const params: QueryParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and PK = :pkVal",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkVal": `TASK_SUBMISSION#${username}`
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const submissions = output.Items.map(rawItem => {
            return <TaskSubmissionResultItem>unmarshall(rawItem);
         });
         return submissions;
      }

      return [];
   } catch (err) {
      throw err;
   }
}

const taskSubmissionService = {
   submitQuestionAnswer,
   submitTaskProgress,
   submitTaskForGrading,
   getTaskSubmission,
   getQuizProgressForTask,
   getTaskRubricProgress,
   listUserSubmissionsByCourse
};

export default taskSubmissionService;
