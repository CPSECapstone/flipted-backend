import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  GetItemCommand,
  GetItemCommandOutput
} from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";
import { QuizInput } from "../interfaces";
import { uid } from "uid/secure";

const client = new DynamoDBClient({ region: "us-east-1" });
const QUIZZES_TABLE = "Quizzes-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function getQuizById(_: any, args: any, context: any, info: any) {
  const command = new GetItemCommand({
    TableName: QUIZZES_TABLE,
    Key: marshall({
      id: args.id
    }, marshallOpts)
  });
  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      return unmarshall(output.Item);
    }
    throw new Error(`Quiz not found with id=${args.id}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function addQuiz(_: any, args: any, context: any, info: any) {
  const quiz: QuizInput = args.quiz;
  const params = {
    TableName: QUIZZES_TABLE,
    Item: marshall({
      id: uid(),
      course: quiz.course,
      name: quiz.name,
      totalPoints: quiz.totalPoints,
      instructions: quiz.instructions,
      questions: quiz.questions
    },
      marshallOpts
    ),
    ReturnValues: "ALL_OLD",
  };
  const command = new PutItemCommand(params);
  try {
    const output: PutItemCommandOutput = await client.send(command);
    console.log(output);
    return unmarshall(params.Item);
  } catch (err) {
    console.log(err);
    return err;
  }
}

const resolvers = {
  Query: {
    quiz: getQuizById
  },
  Mutation: {
    addQuiz: addQuiz
  }
};

export default resolvers;
