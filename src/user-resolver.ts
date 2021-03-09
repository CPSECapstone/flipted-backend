const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { environment } = require("./environment");
const client = new DynamoDBClient({ region: "us-east-1" });
//THIS IS THE RESOLVER FUNCTION FOR USERS
//GATHERS ITEMS FROM USERS TABLE IN DYNAMODB
export class UserResolvers {
  getUsers = async () => {
    const params = {
      TableName: "Users-" + environment.stage,
    };
  
    try {
      const results = await client.send(new ScanCommand(params));
      const users : any[] = [];
      results.Items.forEach((item : any) => {
        users.push(unmarshall(item));
      });
      return users;
    } catch (err) {
      console.error(err);
      return err;
    }
  };
}
 //END OF USER RESOLVER FUNCTION