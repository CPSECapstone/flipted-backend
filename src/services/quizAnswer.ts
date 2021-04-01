import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  GetItemCommand,
  GetItemCommandOutput,
  ScanCommand,
  ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";
import { AnswerInput, Answer } from "../interfaces";

const client = new DynamoDBClient({ region: "us-east-1" });
const ANSWERS_TABLE = "Answers-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function add(answer: Answer) {
  const command = new PutItemCommand({
    TableName: ANSWERS_TABLE,
    Item: marshall(answer, marshallOpts)
  });
  try {
    const output: PutItemCommandOutput = await client.send(command);
    return answer.id;
  } catch (err) {
    return err;
  }
}

// the primary key of Answer Table is questiond ID
async function getById(questionId: string): Promise<Answer> {
  const command = new GetItemCommand({
    TableName: ANSWERS_TABLE,
    Key: marshall({
      id: questionId
    }, marshallOpts)
  });
  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      return <Answer>unmarshall(output.Item);
    }
    throw new Error(`Answer not found with id=${questionId}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function listByQuizId(quizId: string): Promise<Answer[]> {
  const command = new ScanCommand({
    TableName: ANSWERS_TABLE,
    FilterExpression: 'quizId = :quizId',
    ExpressionAttributeValues: marshall({
      ":quizId": quizId
    }, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    if (output.Items) {
      const answers = output.Items.map((item: any) => <Answer>unmarshall(item));
      return answers;
    }

    return [];
  } catch (err) {
    return err;
  }
}

const answersService = {
  add,
  getById,
  listByQuizId
}

export default answersService;
