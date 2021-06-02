import { unmarshall } from "@aws-sdk/util-dynamodb";
import { MASTERY_TABLE, TASK_SUBMISSIONS_TABLE } from "../environment";
import {
   Answer,
   QuestionAnswerItem,
   TaskProgressItem,
   TaskSubmissionResultItem
} from "./taskSubmissionInterface";
import * as questionService from "../services/question";

import dynamodb from "../services/dynamodb";
import {
   associateQuestionWithAnswers,
   createMasteryItem,
   createTaskSubmissionSummaries,
   dbItemsToQuestionAnswerItems,
   dbItemToTaskProgress,
   dbItemToTaskSubmissionResult,
   taskSubResultToDBItem
} from "./taskSubmissionHelper";
import { listObjectivesIdsByTask } from "../progress/progressService";
import * as rosterService from "../roster/rosterService";
import { MasteryItem } from "../progress/progressInterface";
import taskService from "../task/task.service";

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

async function submitTaskForGrading(
   task: Task,
   taskResult: TaskSubmissionResult,
   username: string
) {
   const dbItem: TaskSubmissionResultItem = taskSubResultToDBItem(
      task.course,
      task.missionId,
      taskResult,
      username
   );

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

export async function generateTaskSubmission(taskId: string, username: string) {
   const questionAnswers: Answer[] = await taskSubmissionService.getQuizProgressForTask(
      taskId,
      username
   );

   // Get all questions associated with the task
   const questions: Question[] = await questionService.listByIds(
      questionAnswers.map(qa => {
         return qa.questionId;
      }),
      true
   );

   const taskSubmission = await taskSubmissionService.getTaskSubmission(username, taskId);
   const questionAndAnswers = associateQuestionWithAnswers(questions, questionAnswers);

   // only factor in teacher awarded free points if full task is graded
   // otherwise it will duplicate add automatically generated scores
   const pointAwarded =
      questionAnswers.reduce((a, b) => a + b.pointsAwarded, 0) +
      (taskSubmission.graded && taskSubmission.pointsAwarded ? taskSubmission.pointsAwarded : 0);

   return {
      questionAndAnswers: questionAndAnswers,
      pointsAwarded: pointAwarded,
      pointsPossible: taskSubmission.pointsPossible,
      teacherComment: taskSubmission.teacherComment,
      taskId: taskSubmission.taskId,
      graded: taskSubmission.graded
   };
}

async function listUserSubmissionsByCourse(
   course: string,
   username: string
): Promise<TaskSubmissionResultItem[]> {
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

async function listUserMasteryItemsByCourse(
   course: string,
   username: string
): Promise<TaskSubmissionResultItem[]> {
   const params: QueryParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal",
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

async function generateMasteryItemsForTask(username: string, taskId: string, course: string) {
   const objectiveIds: string[] = await listObjectivesIdsByTask(taskId);
   const items: MasteryItem[] = objectiveIds.map(objId => {
      return createMasteryItem(username, course, objId, taskId);
   });

   items.forEach(async item => {
      await putMasteryItem(item);
   });
}

async function putMasteryItem(item: MasteryItem) {
   const params: PutCompositeParams = {
      tableName: MASTERY_TABLE,
      conditionalExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      item: item
   };
   try {
      return dynamodb.putComposite(params);
   } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
         return;
      }
      throw err;
   }
}

async function listAllSubmissionsByCourse(course: string): Promise<TaskSubmissionSummary[]> {
   const params: QueryParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :pkPrefixVal)",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkPrefixVal": `TASK_SUBMISSION`
      }
   };

   try {
      const submissions: TaskSubmissionResultItem[] = await dynamodb.queryList<TaskSubmissionResultItem>(
         params
      );
      const students: Student[] = await rosterService.listStudentsByCourse(course);
      const tasks: Task[] = await taskService.listTasksByCourse(course);
      const summaries = createTaskSubmissionSummaries(students, tasks, submissions);

      return summaries;
   } catch (err) {
      console.log(err);
      return [];
   }
}

const taskSubmissionService = {
   submitQuestionAnswer,
   submitTaskProgress,
   submitTaskForGrading,
   getTaskSubmission,
   getQuizProgressForTask,
   getTaskRubricProgress,
   listUserSubmissionsByCourse,
   listUserMasteryItemsByCourse,
   generateMasteryItemsForTask,
   generateTaskSubmission,
   listAllSubmissionsByCourse
};

export default taskSubmissionService;
