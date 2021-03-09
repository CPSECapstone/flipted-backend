import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { uid } from 'uid/secure';

import { environment } from "../environment";
import { MissionInput } from "../interfaces";

const client = new DynamoDBClient({ region: "us-east-1" });
const MISSION_TABLE = "Missions-" + environment.stage;

const resolvers = {
  Query: {
    getMissions: async () => {
      const command = new ScanCommand({ TableName: MISSION_TABLE });
      try {
        const results = await client.send(command);
        const missions: any[] = [];
        if (results.Items) {
          results.Items.forEach((item: any) => {
            missions.push(unmarshall(item));
          });
        }
        return missions;
      } catch (err) {
        console.error(err);
        return err;
      }
    }
  },
  Mutation: {
    addMission: async (_: any, args: any, context: any, info: any) => {
      const mission: MissionInput = args.mission;
      const command = new PutItemCommand({
        TableName: MISSION_TABLE,
        Item: {
          "id": { S: uid() },
          "name": { S: mission.name.toString() },
          "description": { S: mission.description.toString() }
        },
        ReturnValues: "ALL_OLD",
      });

      try {
        const results = await client.send(command);
        return {
          name: mission.name.toString(),
          description: mission.description.toString(),
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  }
}

export default resolvers;
