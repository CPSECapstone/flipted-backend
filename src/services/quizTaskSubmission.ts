import { unmarshall } from "@aws-sdk/util-dynamodb";

import { environment } from "../environment";
import {
  MultipleChoiceQuestion, QuizTaskSubmission, QuizTaskSubmissionInput, QuizTaskSubmissionSummary, StudentAnswerInput, StudentAnswerResult
} from "../interfaces";

import questionService from "./question";
import taskService from "./task";
import dynamodb, { GetParams, PutParams, ScanParams } from "./dynamodb";

const TASK_SUBMISSIONS_TABLE = environment.taskSubmissionsTable;

function computeResult(questions: MultipleChoiceQuestion[], answers: StudentAnswerInput[]) {
  let map: Map<string, MultipleChoiceQuestion> = new Map();
  questions.forEach((question: MultipleChoiceQuestion) => {
    map.set(question.id, question);
  });

  let results: StudentAnswerResult[] = [];

  answers.forEach((answer: StudentAnswerInput) => {
    const questionId = answer.questionId;
    const questtion = map.get(questionId);
    if (!questtion) {
      return;
    }

    const correctChoices = questtion.answers;
    const result = answer.choices[0] === correctChoices[0];
    const points = result ? questtion.points : 0;

    results.push({
      questionId,
      result,
      points,
      choices: answer.choices,
      correctChoices
    });
  });

  return results;
}

async function add(submission: QuizTaskSubmissionInput) {
  try {
    const questions = await questionService.listQuestionsByTaskId(submission.taskId);
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

    const submission = <QuizTaskSubmissionSummary>(unmarshall(output.Item));
    const taskId = submission.taskId;
    const task = await taskService.getById(submission.taskId);
    const questions = await questionService.listQuestionsByTaskId(taskId);

    return { task, questions, submission };
  } catch (err) {
    return err;
  }
}

async function listByTaskId(taskId: string): Promise<QuizTaskSubmission[]> {
  const param: ScanParams = {
    tableName: TASK_SUBMISSIONS_TABLE,
    filterExpression: 'taskId = :taskId',
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
      return <QuizTaskSubmission>(unmarshall(item));
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
