import { unmarshall } from "@aws-sdk/util-dynamodb";
import { SubMission, SubMissionItem, SubMissionInput } from "../interfaces/mission";
import { dbItemToSubMission, convertSubMissionInputToItem } from "../services/missionLogic";
import { COURSE_CONTENT_TABLE_NAME } from "../environment";
import dynamodb, { GetCompositeParams, PutCompositeParams, ScanParams } from "./dynamodb";

const SUBMISSIONS_TABLE = COURSE_CONTENT_TABLE_NAME;

async function addSubMission(subMissionInput: SubMissionInput) {
   const subMissionItem: SubMissionItem = convertSubMissionInputToItem(subMissionInput);

   const params: PutCompositeParams = {
      tableName: SUBMISSIONS_TABLE,
      item: subMissionItem
   };

   try {
      await dynamodb.putComposite(params);
      const [type, id] = subMissionItem.PK.split("#");
      return id;
   } catch (err) {
      return err;
   }
}

async function getSubMissionById(subMissionId: string): Promise<SubMission> {
   const getparams: GetCompositeParams = {
      tableName: SUBMISSIONS_TABLE,
      key: {
         PK: `SUBMISSION#${subMissionId}`,
         SK: `SUBMISSION#${subMissionId}`
      }
   };

   try {
      const output = await dynamodb.getComposite(getparams);
      if (!output.Item) {
         throw new Error(`SubMission not found with id=${subMissionId}`);
      }
      return dbItemToSubMission(<SubMissionItem>unmarshall(output.Item));
   } catch (err) {
      return err;
   }
}

const subMissionService = {
   addSubMission,
   getSubMissionById
};

export default subMissionService;
