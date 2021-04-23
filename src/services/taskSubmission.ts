import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TABLE_NAME } from "../environment";
import {
   FreeResponseAnswerItem,
   MultipleChoiceAnswerItem,
   QuestionAnswer,
   QuestionAnswerItem,
   TaskProgress,
   TaskProgressItem
} from "../interfaces/taskSubmission";

import dynamodb, { GetCompositeParams, PutCompositeParams, QueryParams } from "./dynamodb";
import { dbItemsToTaskItem } from "./taskBusLogic";
import { dbItemsToQuestionAnswerItems } from "./taskSubmissionHelper";

const TASK_SUBMISSIONS_TABLE = TABLE_NAME("TaskSubmissions");

async function submitTaskProgress(taskProgress: TaskProgressItem) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: taskProgress
   };
   return dynamodb.putComposite(params);
}

async function submitQuestionAnswer(answer: QuestionAnswerItem) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: answer
   };
   return dynamodb.putComposite(params);
}

async function getTaskSubmission(username: string, taskId: string) {
   const params: PutCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      item: {}
   };
   return dynamodb.putComposite(params);
}

async function getTaskRubricProgress(taskId: string, username: string): Promise<TaskProgress> {
   const params: GetCompositeParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      key: {
         PK: "USER#" + username,
         SK: taskId
      }
   };

   const output = await dynamodb.getComposite(params);
   if (output.Item) {
      const taskProgress = <TaskProgressItem>unmarshall(output.Item);
      return dbItemToTaskProgressItem(taskProgress);
   }

   throw new Error(`Task not found with id=${taskId}`);
}

async function getQuizProgressForTask(taskId: string, username: string): Promise<QuestionAnswer[]> {
   const params: QueryParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      keyConditionExpression: "PK = :pkVal",
      filterExpression: "taskId = :taskId",
      expressionAttributeValues: {
         ":pkVal": `USER#${username}`,
         ":taskId": taskId
      }
   };

   const output = await dynamodb.query(params);
   if(output.Items) {
      const questionAnswerItems = output.Items.map((item: any) => {
         return <QuestionAnswerItem>unmarshall(item);
      });

      return dbItemsToQuestionAnswerItems(questionAnswerItems);
   }
   throw new Error(`Task not found with id=${taskId}`);
}

async function submitTaskForGrading() {
   return false
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
function dbItemToTaskProgressItem(taskProgress: TaskProgressItem): TaskProgress | PromiseLike<TaskProgress> {
   throw new Error("Function not implemented.");
}

