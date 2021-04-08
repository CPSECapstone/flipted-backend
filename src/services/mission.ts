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
import { Mission, MissionInput } from "../interfaces";
import { uid } from "uid/secure";
import subMissionService from "./subMission";

const client = new DynamoDBClient({ region: "us-east-1" });
const MISSIONS_TABLE = "Missions-" + environment.stage;

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function add(input: MissionInput) {
  const mission = <Mission>input;
  mission.id = uid();

  const command: PutItemCommand = new PutItemCommand({
    TableName: MISSIONS_TABLE,
    Item: marshall(mission, marshallOpts),
    ReturnValues: "ALL_OLD",
  });

  try {
    const output: PutItemCommandOutput = await client.send(command);
    return mission.id;
  } catch (err) {
    return err;
  }
}

async function getById(missionId: string): Promise<Mission> {
  const command = new GetItemCommand({
    TableName: MISSIONS_TABLE,
    Key: marshall({
      id: missionId
    }, marshallOpts)
  });

  try {
    const output: GetItemCommandOutput = await client.send(command);
    if (output.Item) {
      const mission = <Mission>unmarshall(output.Item);
      const subMissions = await subMissionService.listByMissionId(mission.id);
      mission.subMissions = subMissions;
      return mission;
    }

    throw new Error(`Mission not found with id=${missionId}`);
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function listByCourse(course: string): Promise<Mission[]> {
  const command = new ScanCommand({
    TableName: MISSIONS_TABLE,
    FilterExpression: 'course = :course',
    ExpressionAttributeValues: marshall({
      ":course": course
    }, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    if (output.Items) {
      const objectives = output.Items.map((item: any) => {
        return <Mission>unmarshall(item);
      });
      return objectives;
    }

    return [];
  } catch (err) {
    console.error(err);
    return err;
  }
}

const missionService = {
  add,
  getById,
  listByCourse
}

export default missionService;
