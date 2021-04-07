import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  ScanCommand,
  ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";
import { LearningObjective, LearningObjectiveInput } from "../interfaces";
import { uid } from "uid/secure";

const client = new DynamoDBClient({ region: "us-east-1" });
const LEARNING_OBJECTIVES_TABLE = "LearningObjectives-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function add(input: LearningObjectiveInput) {
  const objective = <LearningObjective>input;
  objective.id = uid();

  const command: PutItemCommand = new PutItemCommand({
    TableName: LEARNING_OBJECTIVES_TABLE,
    Item: marshall(objective, marshallOpts),
    ReturnValues: "ALL_OLD",
  });

  try {
    const output: PutItemCommandOutput = await client.send(command);
    return objective.id;
  } catch (err) {
    return err;
  }
}

async function listByCourse(course: string): Promise<LearningObjective[]> {
  const command = new ScanCommand({
    TableName: LEARNING_OBJECTIVES_TABLE,
    FilterExpression: 'course = :course',
    ExpressionAttributeValues: marshall({
      ":course": course
    }, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    if (output.Items) {
      const objectives = output.Items.map((item: any) => {
        return <LearningObjective>unmarshall(item);
      });
      return objectives;
    }

    return [];
  } catch (err) {
    console.error(err);
    return err;
  }
}

const learningObjectiveService = {
  add,
  listByCourse
}

export default learningObjectiveService;
