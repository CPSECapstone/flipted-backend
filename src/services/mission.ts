import { unmarshall } from "@aws-sdk/util-dynamodb";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import { MissionItem } from "../interfaces/mission";

import dynamodb, {
   PutCompositeParams,
   ScanParams,
   GetCompositeParams,
   QueryParams
} from "./dynamodb";
import {
   dbItemsToMissionContent,
   dbMissionItemToMission,
   convertMissionInputToItem
} from "./missionLogic";

const MISSIONS_TABLE = COURSE_CONTENT_TABLE_NAME;

async function addMission(missionInput: MissionInput) {
   const missionItem = convertMissionInputToItem(missionInput);

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

async function getMissionContent(missionId: string): Promise<MissionContent[]> {
   const params: QueryParams = {
      tableName: MISSIONS_TABLE,
      keyConditionExpression: "parentMissionId = :missionId",
      expressionAttributeValues: {
         ":missionId": missionId
      },
      indexName: "parentMissionId-index"
   };

   try {
      const output = await dynamodb.query(params);
      console.log(output);
      return await dbItemsToMissionContent(output.Items);
   } catch (err) {
      return err;
   }
}

async function getMissionById(missionId: string): Promise<Mission> {
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
      return dbMissionItemToMission(<MissionItem>unmarshall(output.Item));
   } catch (err) {
      return err;
   }
}

async function listByCourse(course: string): Promise<Mission[]> {
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
            return dbMissionItemToMission(<MissionItem>unmarshall(item));
         });
         return missions;
      }

      return [];
   } catch (err) {
      return err;
   }
}

function resolveMissionContentType(missionContent: any) {
   if (missionContent.pages) {
      return "Task";
   }
   return "SubMission";
}

const missionService = {
   addMission,
   getMissionById,
   listByCourse,
   getMissionContent,
   resolveMissionContentType
};

export default missionService;
