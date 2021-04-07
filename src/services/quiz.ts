import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandOutput
} from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";
import { Quiz, QuizInput } from "../interfaces";
import { uid } from "uid/secure";

const client = new DynamoDBClient({ region: "us-east-1" });
const QUIZZES_TABLE = "Quizzes-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function add(input: QuizInput): Promise<string> {
  const quiz = <Quiz>input;
  quiz.id = uid();

  const command: PutItemCommand = new PutItemCommand({
    TableName: QUIZZES_TABLE,
    Item: marshall(quiz, marshallOpts),
    ReturnValues: "ALL_OLD",
  });

  try {
    const output: PutItemCommandOutput = await client.send(command);
    return quiz.id;
  } catch (err) {
    return err;
  }
}

async function getById(quizId: string) {
  const command = new GetItemCommand({
    TableName: QUIZZES_TABLE,
    Key: marshall({
      id: quizId
    }, marshallOpts)
  });
  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      return unmarshall(output.Item);
    }
    throw new Error(`Quiz not found with id=${quizId}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

const quizService = {
  add,
  getById
}

export default quizService;
