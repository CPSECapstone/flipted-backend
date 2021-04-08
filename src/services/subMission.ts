import { marshall, unmarshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandOutput,
  ScanCommand,
  ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import { environment } from "../environment";
import { SubMission, SubMissionInput } from "../interfaces";
import { uid } from "uid/secure";
import taskService from "./task";

const client = new DynamoDBClient({ region: "us-east-1" });
const SUBMISSIONS_TABLE = "SubMissions-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function add(input: SubMissionInput) {
  const subMission = <SubMission>input;
  subMission.id = uid();

  const command: PutItemCommand = new PutItemCommand({
    TableName: SUBMISSIONS_TABLE,
    Item: marshall(subMission, marshallOpts),
    ReturnValues: "ALL_OLD",
  });

  try {
    const output: PutItemCommandOutput = await client.send(command);
    return subMission.id;
  } catch (err) {
    return err;
  }
}

async function getById(subMissionId: string): Promise<SubMission> {
  const command = new GetItemCommand({
    TableName: SUBMISSIONS_TABLE,
    Key: marshall({
      id: subMissionId
    }, marshallOpts)
  });

  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      const subMission = <SubMission>unmarshall(output.Item);
      const tasks = await taskService.listBySubMissionId(subMission.id);
      subMission.tasks = tasks;
      return subMission;
    }

    throw new Error(`SubMission not found with id=${subMissionId}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function listByMissionId(missionId: string): Promise<SubMission[]> {
  const command = new ScanCommand({
    TableName: SUBMISSIONS_TABLE,
    FilterExpression: 'missionId = :missionId',
    ExpressionAttributeValues: marshall({
      ":missionId": missionId
    }, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    if (output.Items) {
      const subMissions = output.Items.map((item: any) => {
        return <SubMission>unmarshall(item);
      });
      return subMissions;
    }

    return [];
  } catch (err) {
    console.error(err);
    return err;
  }
}


const subMissionService = {
  add,
  listByMissionId
}

export default subMissionService;
