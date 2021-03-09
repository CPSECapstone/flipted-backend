const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { environment } = require("./environment");
const client = new DynamoDBClient({ region: "us-east-1" });

export class MissionResolvers {
  getMissions = async () => {
    const params = {
      TableName: "Missions-" + environment.stage,
    };
  
    try {
      const results = await client.send(new ScanCommand(params));
      const missions: any[] = [];
      results.Items.forEach((item : any) => {
        missions.push(unmarshall(item));
      });
      return missions;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  addMission = async () => {

  }
}