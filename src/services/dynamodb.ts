import { marshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandOutput,
  ScanCommand,
  ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import { uid } from "uid/secure";

const client = new DynamoDBClient({ region: "us-east-1" });

const marshallOpts: marshallOptions = {
  removeUndefinedValues: true,
  convertEmptyValues: false,
  convertClassInstanceToMap: true,
};

async function put(params: PutParams): Promise<string> {
  const identifiableItem = {
    id: uid(),
    ...params.item
  };

  const command: PutItemCommand = new PutItemCommand({
    TableName: params.tableName,
    Item: marshall(identifiableItem, marshallOpts),
    ReturnValues: "ALL_OLD",
  });

  try {
    const output: PutItemCommandOutput = await client.send(command);
    return identifiableItem.id;
  } catch (err) {
    return err;
  }
}

async function get(params: any): Promise<GetItemCommandOutput> {
  const command = new GetItemCommand({
    TableName: params.tableName,
    Key: marshall({
      id: params.id
    }, marshallOpts)
  });

  try {
    const output: GetItemCommandOutput = await client.send(command);
    return output;
  } catch (err) {
    return err;
  }
}

async function scan(params: any): Promise<ScanCommandOutput> {
  const command = new ScanCommand({
    TableName: params.tableName,
    FilterExpression: params.filterExpression,
    ExpressionAttributeValues: marshall(params.expressionAttributeValues, marshallOpts)
  });

  try {
    const output: ScanCommandOutput = await client.send(command);
    return output;
  } catch (err) {
    console.error(err);
    return err;
  }
}

const dynamodb = {
  put,
  get,
  scan
};

export default dynamodb;

export interface PutParams {
  tableName: string
  item: object
}

export interface GetParams {
  tableName: string
  key: string
}

export interface ScanParams {
  tableName: string
  filterExpression: string
  expressionAttributeValues: object,
  limit?: number
}
