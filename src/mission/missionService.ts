import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import { MissionItem, MissionPrefix } from "./missionInterface";
import dynamodb, {
   PutCompositeParams,
   GetCompositeParams,
   QueryParams,
   ScanParams,
   BatchWriteParams
} from "../services/dynamodb";
import * as helper from "./missionLogic";

const MISSIONS_TABLE = COURSE_CONTENT_TABLE_NAME;

export async function addMission(missionInput: MissionInput) {
   const missionItem = helper.convertMissionInputToItem(missionInput);

   const params: PutCompositeParams = {
      tableName: MISSIONS_TABLE,
      item: missionItem
   };

   try {
      await dynamodb.putComposite(params);
      const [type, id] = missionItem.PK.split("#");
      return id;
   } catch (err) {
      return err;
   }
}

export async function getMissionContent(missionId: string): Promise<MissionContent[]> {
   const params: QueryParams = {
      tableName: MISSIONS_TABLE,
      keyConditionExpression: "missionId = :missionId",
      expressionAttributeValues: {
         ":missionId": missionId
      },
      indexName: "missionId-index"
   };

   try {
      const output = await dynamodb.query(params);
      console.log(output);
      return helper.dbItemsToMissionContent(output.Items);
   } catch (err) {
      return err;
   }
}

export async function getMissionById(missionId: string): Promise<Mission> {
   const getparams: GetCompositeParams = {
      tableName: MISSIONS_TABLE,
      key: {
         PK: `MISSION#${missionId}`,
         SK: `MISSION#${missionId}`
      }
   };

   try {
      const output = await dynamodb.getComposite(getparams);
      if (!output.Item) {
         throw new Error(`Mission not found with id=${missionId}`);
      }

      return helper.dbMissionItemToMission(<MissionItem>unmarshall(output.Item));
   } catch (err) {
      return err;
   }
}

export async function listByCourse(course: string): Promise<Mission[]> {
   const params: QueryParams = {
      tableName: MISSIONS_TABLE,
      indexName: "course-PK-index",
      keyConditionExpression: "course = :courseVal and begins_with(PK, :pkVal)",
      expressionAttributeValues: {
         ":courseVal": course,
         ":pkVal": "MISSION"
      }
   };

   try {
      const output = await dynamodb.query(params);
      if (output.Items) {
         const missions = output.Items.map((item: any) => {
            return helper.dbMissionItemToMission(<MissionItem>unmarshall(item));
         });
         return missions;
      }

      return [];
   } catch (err) {
      return err;
   }
}

export function resolveMissionContentType(missionContent: any) {
   if (missionContent.pages) {
      return "Task";
   }
   return "SubMission";
}

export async function importMissions(missionItems: MissionItem[]): Promise<number> {
   missionItems.forEach(mission => {
      mission.source = "imported";
   });

   const params: BatchWriteParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      items: missionItems
   };

   try {
      return dynamodb.batchWrite(params);
   } catch (err) {
      return err;
   }
}

export async function deleteMissions(): Promise<number> {
   const params: ScanParams = {
      tableName: COURSE_CONTENT_TABLE_NAME,
      filterExpression: "begins_with(PK, :pkPrefix)",
      expressionAttributeValues: {
         ":pkPrefix": MissionPrefix
      }
   };

   try {
      const output = await dynamodb.batchDelete(params);
      return output;
   } catch (err) {
      return err;
   }
}
