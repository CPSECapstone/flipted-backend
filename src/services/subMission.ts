import { unmarshall } from "@aws-sdk/util-dynamodb";

import { environment } from "../environment";
import { SubMission, SubMissionInput } from "../interfaces";
import taskService from "./task";
import dynamodb, { GetParams, PutParams, ScanParams } from "./dynamodb";

const SUBMISSIONS_TABLE = "SubMissions-" + environment.stage;

async function add(input: SubMissionInput) {
  const params: PutParams = {
    tableName: SUBMISSIONS_TABLE,
    item: input
  };

  return dynamodb.put(params);
}

async function getById(subMissionId: string): Promise<SubMission> {
  const params: GetParams = {
    tableName: SUBMISSIONS_TABLE,
    key: subMissionId
  };

  const output = await dynamodb.get(params);
  if (output.Item) {
    const subMission = <SubMission>unmarshall(output.Item);
    const tasks = await taskService.listBySubMissionId(subMission.id);
    subMission.tasks = tasks;
    return subMission;
  }

  throw new Error(`SubMission not found with id=${subMissionId}`);
}

async function listByMissionId(missionId: string): Promise<SubMission[]> {
  const params: ScanParams = {
    tableName: SUBMISSIONS_TABLE,
    filterExpression: 'missionId = :missionId',
    expressionAttributeValues: {
      ":missionId": missionId
    }
  };

  const output = await dynamodb.scan(params);
  if (output.Items) {
    const subMissions = output.Items.map((item: any) => {
      return <SubMission>unmarshall(item);
    });
    return subMissions;
  }

  return [];
}


const subMissionService = {
  add,
  getById,
  listByMissionId
}

export default subMissionService;
