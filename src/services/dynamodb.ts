import { marshall, marshallOptions } from "@aws-sdk/util-dynamodb";
import {
   BatchGetItemCommand,
   BatchGetItemCommandOutput,
   BatchWriteItemCommand,
   BatchWriteItemCommandOutput,
   DynamoDBClient,
   GetItemCommand,
   GetItemCommandOutput,
   UpdateItemCommand,
   UpdateItemCommandOutput,
   PutItemCommand,
   PutItemCommandOutput,
   ScanCommand,
   ScanCommandOutput,
   QueryCommandOutput,
   QueryCommand,
   DeleteItemCommandOutput,
   DeleteItemCommand,
   ItemResponse
} from "@aws-sdk/client-dynamodb";
import { uid } from "uid/secure";

const client = new DynamoDBClient({ region: "us-east-1" });

const marshallOpts: marshallOptions = {
   removeUndefinedValues: true,
   convertEmptyValues: false,
   convertClassInstanceToMap: true
};

async function put(params: PutParams): Promise<string> {
   const identifiableItem = {
      id: uid(),
      ...params.item
   };

   const command: PutItemCommand = new PutItemCommand({
      TableName: params.tableName,
      Item: marshall(identifiableItem, marshallOpts),
      ReturnValues: "ALL_OLD"
   });

   try {
      const output: PutItemCommandOutput = await client.send(command);
      return identifiableItem.id;
   } catch (err) {
      return err;
   }
}

async function putComposite(params: PutCompositeParams): Promise<PutItemCommandOutput> {
   const command: PutItemCommand = new PutItemCommand({
      TableName: params.tableName,
      Item: marshall(params.item, marshallOpts),
      ReturnValues: "ALL_OLD"
   });

   return client.send(command);
}

async function get(params: GetParams): Promise<GetItemCommandOutput> {
   const command = new GetItemCommand({
      TableName: params.tableName,
      Key: marshall(
         {
            id: params.key
         },
         marshallOpts
      ),
      ProjectionExpression: params.projectionExpression
   });

   try {
      const output: GetItemCommandOutput = await client.send(command);
      return output;
   } catch (err) {
      return err;
   }
}

async function update(params: UpdateParams): Promise<UpdateItemCommandOutput> {
   const command = new UpdateItemCommand({
      TableName: params.tableName,
      Key: marshall(
         {
            id: params.key
         },
         marshallOpts
      ),
      UpdateExpression: params.updateExpression,
      ExpressionAttributeValues: marshall(params.expressionAttributeValues, marshallOpts),
      ReturnValues: "UPDATED_NEW"
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

async function scan(params: ScanParams): Promise<ScanCommandOutput> {
   const command = new ScanCommand({
      TableName: params.tableName,
      FilterExpression: params.filterExpression,
      ExpressionAttributeValues: marshall(params.expressionAttributeValues, marshallOpts),
      ExpressionAttributeNames: params.expressionAttributeNames,
      ExclusiveStartKey: params.ExclusiveStartKey
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
   const keys = params.keys.map(key => {
      return marshall(key);
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

async function query(params: QueryParams): Promise<QueryCommandOutput> {
   const command = new QueryCommand({
      TableName: params.tableName,
      FilterExpression: params.filterExpression,
      IndexName: params.indexName,
      KeyConditionExpression: params.keyConditionExpression,
      ExpressionAttributeValues: marshall(params.expressionAttributeValues, marshallOpts)
   });

   return client.send(command);
}

async function deleteItem(params: DeleteParam): Promise<DeleteItemCommandOutput> {
   const command = new DeleteItemCommand({
      TableName: params.tableName,
      Key: marshall(params.key, marshallOpts),
      ReturnValues: "ALL_OLD",
      ReturnConsumedCapacity: "TOTAL"
   });

   return client.send(command);
}

/*
   write to database in batch mode
*/
async function batchWrite(params: BatchWriteParams): Promise<number> {
   let leftItems = params.items.length;
   let group = [];
   let groupNumber = 0;
   console.log("Total items to be imported", leftItems);

   for (const item of params.items) {
      const putRequests = {
         PutRequest: {
            Item: marshall(item, marshallOpts)
         }
      };

      group.push(putRequests);
      leftItems--;

      if (group.length == 25 || leftItems < 1) {
         groupNumber++;
         console.log(`Batch ${groupNumber} to be imported.`);
         try {
            const command = new BatchWriteItemCommand({
               RequestItems: {
                  [params.tableName]: group
               },
               ReturnConsumedCapacity: "INDEXES",
               ReturnItemCollectionMetrics: "SIZE"
            });

            await client.send(command);
            console.log(`Batch ${groupNumber} processed. Left items: ${leftItems}`);
            //reset
            group = [];
         } catch (err) {
            console.log(err);
         }
      }
   }

   return params.items.length;
}

/*
   delete all items in the table in batch mode
*/
export async function batchDelete(scanParams: ScanParams): Promise<number> {
   let items: any[] = [];
   try {
      let output = await scan(scanParams);
      items = [...items, ...(output.Items || [])];

      while (typeof output.LastEvaluatedKey != "undefined") {
         scanParams.ExclusiveStartKey = output.LastEvaluatedKey;

         output = await scan(scanParams);
         items = [...items, ...(output.Items || [])];
      }
   } catch (err) {
      console.log(err);
      return 0;
   }

   let leftItems = items.length;
   let group = [];
   let groupNumber = 0;
   console.log("Total items to be deleted", leftItems);

   for (const item of items) {
      const deleteRequest = {
         DeleteRequest: {
            Key: {
               PK: item.PK,
               SK: item.SK
            }
         }
      };
      console.log(item.PK);

      group.push(deleteRequest);
      leftItems--;

      if (group.length == 25 || leftItems < 1) {
         groupNumber++;
         console.log(`Batch ${groupNumber} to be deleted.`);
         try {
            const command = new BatchWriteItemCommand({
               RequestItems: {
                  [scanParams.tableName]: group
               },
               ReturnConsumedCapacity: "TOTAL"
            });

            await client.send(command);
            console.log(`Batch ${groupNumber} processed. Left items: ${leftItems}`);
            //reset
            group = [];
         } catch (err) {
            console.log(err);
         }
      }
   }

   return items.length;
}

const dynamodb = {
   put,
   get,
   getComposite,
   putComposite,
   scan,
   update,
   batchGet,
   query,
   deleteItem,
   batchWrite,
   batchDelete
};

export default dynamodb;

export interface PutParams {
   tableName: string;
   item: object;
}

export interface PutCompositeParams {
   tableName: string;
   item: object;
}

export interface UpdateParams {
   tableName: string;
   key: string;
   updateExpression: string;
   expressionAttributeValues: { [key: string]: any };
}

export interface GetParams {
   tableName: string;
   key: string;
   projectionExpression?: string;
}

export interface GetCompositeParams {
   tableName: string;
   key: object;
   projectionExpression?: string;
}

export interface ScanParams {
   tableName: string;
   filterExpression: string;
   expressionAttributeValues: object;
   expressionAttributeNames?: { [key: string]: string };
   limit?: number;
   ExclusiveStartKey?: { [key: string]: any };
}

export interface BatchGetParams {
   tableName: string;
   keys: { [key: string]: string }[];
   projectionExpression?: string;
}

export interface BatchWriteParams {
   tableName: string;
   items: object[];
}

export interface QueryParams {
   tableName: string;
   keyConditionExpression: string;
   expressionAttributeValues: { [key: string]: any };
   filterExpression?: string;
   indexName?: string;
}

export interface DeleteParam {
   tableName: string;
   key: { [key: string]: any };
}

export interface DBItem {
   id: string;
}

export interface CompositeDBItem {
   PK: string;
   SK: string;
}
