import { unmarshall } from "@aws-sdk/util-dynamodb";

import { TABLE_NAME } from "../environment";
import { Mission, MissionInput } from "../interfaces";
import subMissionService from "./subMission";
import dynamodb, { PutParams, ScanParams } from "./dynamodb";

const MISSIONS_TABLE = TABLE_NAME("Missions");

async function add(input: MissionInput) {
   const params: PutParams = {
      tableName: MISSIONS_TABLE,
      item: input
   };

   return dynamodb.put(params);
}

async function getById(missionId: string): Promise<Mission> {
   const params = {
      tableName: MISSIONS_TABLE,
      key: missionId
   };

   const output = await dynamodb.get(params);
   if (output.Item) {
      const mission = <Mission>unmarshall(output.Item);
      const subMissions = await subMissionService.listByMissionId(mission.id);
      mission.subMissions = subMissions;
      return mission;
   }

   throw new Error(`Mission not found with id=${missionId}`);
}

async function listByCourse(course: string): Promise<Mission[]> {
   const params: ScanParams = {
      tableName: MISSIONS_TABLE,
      filterExpression: "course = :course",
      expressionAttributeValues: {
         ":course": course
      }
   };

   const output = await dynamodb.scan(params);
   if (output.Items) {
      const objectives = output.Items.map((item: any) => {
         return <Mission>unmarshall(item);
      });
      return objectives;
   }

   return [];
}

const missionService = {
   add,
   getById,
   listByCourse
};

export default missionService;
