import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  ScanCommand,
  ScanCommandOutput,
  PutItemCommandOutput
} from "@aws-sdk/client-dynamodb";
import { uid } from "uid/secure";
import { environment } from "../environment";
import {
  Answer, AnswerInput, MultipleChoiceQuestion, QuizSubmission, QuizSubmissionInput, QuizSubmissionSummary
} from "../interfaces";

import answerService from './quizAnswer';
import questionService from "./quizQuestion";
import quizService from "./quiz";

const client = new DynamoDBClient({ region: "us-east-1" });
const QUIZ_SUBMISSIONS_TABLE = "QuizSubmissions-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

function computeResult(correctAnswers: Answer[], questions: MultipleChoiceQuestion[], answers: AnswerInput[]) {
  // questiondId - choices mapping
  const choicesMapping = new Map();
  correctAnswers.forEach((answer: Answer) => {
    choicesMapping.set(answer.id, answer.choices);
  });
  const pointsMapping = new Map();
  questions.forEach((question: MultipleChoiceQuestion) => {
    pointsMapping.set(question.id, question.points);
  });

  return answers.map((answer: AnswerInput) => {
    const questionId = answer.questionId;
    const correctChoices = choicesMapping.get(questionId);
    const result = answer.choices[0] === correctChoices[0];
    const points = result ? pointsMapping.get(questionId) : 0;
    return {
      questionId,
      result,
      points
    };
  });
}

async function add(submission: QuizSubmissionInput) {
  const submissionId = uid();
  const quizId = submission.quizId;

  try {
    const correctAnswers = await answerService.listByQuizId(quizId);
    const questions = await questionService.listByQuizId(quizId);
    const result = computeResult(correctAnswers, questions, submission.answers);
    const totalPoints = result.reduce((acc, curr) => acc + curr.points, 0);
    const params = {
      TableName: QUIZ_SUBMISSIONS_TABLE,
      Item: marshall({
        id: submissionId,
        student: submission.student,
        quizId: submission.quizId,
        answers: result,
        points: totalPoints
      },
        marshallOpts
      ),
      ReturnValues: "ALL_OLD",
    };

    const command = new PutItemCommand(params);
    const output: PutItemCommandOutput = await client.send(command);
    return submissionId;
  } catch (err) {
    console.log(err);
    return err;
  }
}


async function getById(submissionId: string) {
  const command = new GetItemCommand({
    TableName: QUIZ_SUBMISSIONS_TABLE,
    Key: marshall({
      id: submissionId
    }, marshallOpts)
  });

  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (!output.Item) {
      throw new Error(`Submission not found with id=${submissionId}`);
    }
    const submission = <QuizSubmissionSummary>(unmarshall(output.Item));
    const quizId = submission.quizId;
    const quiz = await quizService.getById(quizId);
    const questions = await questionService.listByQuizId(quizId);
    const answers = await answerService.listByQuizId(quizId);

    return { submission, quiz, questions, answers };
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function listByQuizId(quizId: string): Promise<QuizSubmission[]> {
  const command = new ScanCommand({
    TableName: QUIZ_SUBMISSIONS_TABLE,
    FilterExpression: 'quizId = :quizId',
    ExpressionAttributeValues: marshall({
      ":quizId": quizId
    }, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    if (output.Items) {
      const submissions = output.Items?.map((item: any) => {
        return <QuizSubmission>(unmarshall(item));
      });
      return submissions;
    }

    return [];
  } catch (err) {
    console.error(err);
    return err;
  }
}

const quizSubmissionService = {
  add,
  getById,
  listByQuizId
};

export default quizSubmissionService;
