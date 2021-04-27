import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TABLE_NAME } from "../environment";
import dynamodb, { PutParams, ScanParams } from "./dynamodb";

const LEARNING_OBJECTIVES_TABLE = TABLE_NAME("LearningObjectives");

async function add(input: LearningObjectiveInput) {
   const params: PutParams = {
      tableName: LEARNING_OBJECTIVES_TABLE,
      item: input
   };

   return dynamodb.put(params);
}

async function listByCourse(course: string): Promise<LearningObjective[]> {
   const params: ScanParams = {
      tableName: LEARNING_OBJECTIVES_TABLE,
      filterExpression: "course = :course",
      expressionAttributeValues: {
         ":course": course
      }
   };

   const output = await dynamodb.scan(params);
   if (output.Items) {
      const objectives = output.Items.map((item: any) => {
         return <LearningObjective>unmarshall(item);
      });
      return objectives;
   }

   return [];
}

const learningObjectiveService = {
   add,
   listByCourse
};

export default learningObjectiveService;
