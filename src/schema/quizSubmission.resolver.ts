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
import { environment } from "../environment";
import { QuizSubmissionInput } from "../interfaces";
import { uid } from "uid/secure";

const client = new DynamoDBClient({ region: "us-east-1" });
const QUIZ_SUBMISSIONS_TABLE = "QuizSubmissions-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function listSubmissionsByQuizId(_: any, args: any, context: any) {
  const command = new ScanCommand({
    TableName: QUIZ_SUBMISSIONS_TABLE,
    FilterExpression: 'quiz = :quizId',
    ExpressionAttributeValues: marshall({
      ":quizId": args.quizId
    }, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    const submissions = output.Items?.map((item: any) => unmarshall(item));
    return submissions;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function getSubmissionById(_: any, args: any, context: any, info: any) {
  const command = new GetItemCommand({
    TableName: QUIZ_SUBMISSIONS_TABLE,
    Key: marshall({
      id: args.id
    }, marshallOpts)
  });

  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      return unmarshall(output.Item);
    }
    throw new Error(`Submission not found with id=${args.id}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function submitQuiz(_: any, args: any, context: any, info: any) {
  const submission: QuizSubmissionInput = args.submission;
  const params = {
    TableName: QUIZ_SUBMISSIONS_TABLE,
    Item: marshall({
      id: uid(),
      student: submission.student,
      quiz: submission.quiz,
      choices: submission.choices,
      points: 100
    },
      marshallOpts
    ),
    ReturnValues: "ALL_OLD",
  };
  // todo, calculate points
  const command = new PutItemCommand(params);
  try {
    const output: PutItemCommandOutput = await client.send(command);
    return unmarshall(params.Item);
  } catch (err) {
    console.log(err);
    return err;
  }
}

const resolvers = {
  Query: {
    quizSubmissions: listSubmissionsByQuizId,
    quizSubmission: getSubmissionById
  },
  Mutation: {
    submitQuiz: submitQuiz
  }
};

export default resolvers;
