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
import { uid } from "uid/secure";
import { environment } from "../environment";
import { Answer, MultipleChoiceQuestionInput, MultipleChoiceQuestion } from "../interfaces";
import answerService from './quizAnswer';

const client = new DynamoDBClient({ region: "us-east-1" });
const QUESTIONS_TABLE = "Questions-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function add(question: MultipleChoiceQuestionInput) {
  const questId: string = uid();
  const options = question.options.map((option: string) => {
    return {
      id: uid(),
      description: option
    };
  });

  const choices: string[] = question.answers.map((index: number) => {
    return options[index - 1].id;
  });
  const answer: Answer = {
    id: questId,
    quizId: question.quizId,
    choices
  };

  const command = new PutItemCommand({
    TableName: QUESTIONS_TABLE,
    Item: marshall({
      id: questId,
      quizId: question.quizId,
      description: question.description,
      options,
      points: question.points
    }, marshallOpts)
  });
  try {
    const output: PutItemCommandOutput = await client.send(command);
    const output2 = answerService.add(answer);
    return questId;
  } catch (err) {
    return err;
  }
}

async function getById(questionId: string) {
  const command = new GetItemCommand({
    TableName: QUESTIONS_TABLE,
    Key: marshall({
      id: questionId
    }, marshallOpts),
    ProjectionExpression: "id, quizId, description, options, answers, points"
  });
  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      return unmarshall(output.Item);
    }
    throw new Error(`Quiz not found with id=${questionId}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function listByQuizId(quizId: string): Promise<MultipleChoiceQuestion[]> {
  const command = new ScanCommand({
    TableName: QUESTIONS_TABLE,
    FilterExpression: 'quizId = :quizId',
    ExpressionAttributeValues: marshall({
      ":quizId": quizId
    }, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    if (output.Items) {
      const questions = output.Items.map((item: any) => {
        const unmarshalled = unmarshall(item);
        return <MultipleChoiceQuestion>unmarshalled;
      });
      return questions;
    }

    return [];
  } catch (err) {
    return err;
  }
}

const questionService = {
  add,
  getById,
  listByQuizId
}

export default questionService;
