import { marshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
  BatchGetItemCommand,
  BatchGetItemCommandOutput,
  BatchWriteItemCommand,
  BatchWriteItemCommandOutput,
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

async function putComposite(params: PutCompositeParams): Promise<boolean> {
   const command: PutItemCommand = new PutItemCommand({
     TableName: params.tableName,
     Item: marshall(params.item, marshallOpts),
     ReturnValues: "ALL_OLD",
   });
 
   try {
     const output: PutItemCommandOutput = await client.send(command);
     return true;
   } catch (err) {
     return err;
   }
 }

async function get(params: GetParams): Promise<GetItemCommandOutput> {
  const command = new GetItemCommand({
    TableName: params.tableName,
    Key: marshall({
      id: params.key
    }, marshallOpts),
    ProjectionExpression: params.projectionExpression
  });

  try {
    const output: GetItemCommandOutput = await client.send(command);
    return output;
  } catch (err) {
    return err;
  }
}

async function getComposite(params: GetCompositeParams): Promise<GetItemCommandOutput> {
   const command = new GetItemCommand({
     TableName: params.tableName,
     Key: marshall(params.key, marshallOpts),
     ProjectionExpression: params.projectionExpression
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


async function batchGet(params: BatchGetParams): Promise<BatchGetItemCommandOutput> {
  const keys = params.keyValues.map((value: string) => {
    return marshall({ [params.keyName]: value });
  });

  const command = new BatchGetItemCommand({
    RequestItems: {
      [params.tableName]: {
        Keys: keys,
        ProjectionExpression: params.projectionExpression
      }
    }
  });

  return client.send(command);
}

async function batchWrite(params: BatchWriteParams): Promise<BatchWriteItemCommandOutput> {
  const putRequests = params.items.map((item: { [key: string]: string }) => {
    return {
      PutRequest: {
        Item: marshall(item, marshallOpts)
      }
    };
  });

  const command = new BatchWriteItemCommand({
    RequestItems: {
      [params.tableName]: putRequests
    },
    ReturnConsumedCapacity: "TOTAL"
  });

  return client.send(command);
}

const dynamodb = {
  put,
  get,
  getComposite,
  putComposite,
  scan,
  batchGet,
  batchWrite
};

export default dynamodb;

export interface PutParams {
  tableName: string
  item: object
}

export interface PutCompositeParams {
   tableName: string
   item: object
}

export interface UpdateParams {
  tableName: string
  id: string
}

export interface GetParams {
  tableName: string
  key: string,
  projectionExpression?: string
}

export interface GetCompositeParams {
   tableName: string
   key: object,
   projectionExpression?: string
}

export interface ScanParams {
  tableName: string
  filterExpression: string
  expressionAttributeValues: object,
  limit?: number
}

export interface BatchGetParams {
  tableName: string,
  keyName: string,
  keyValues: string[]
  projectionExpression?: string
}

export interface BatchWriteParams {
  tableName: string,
  items: { [key: string]: string }[]
}

