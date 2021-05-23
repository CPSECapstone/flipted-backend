import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TASK_SUBMISSIONS_TABLE } from "../environment";
import dynamodb from "../services/dynamodb";

export async function updateTaskGrade(input: TaskSubmissionGradeInput) {
   const key: CompositeDBItem = {
      PK: `TASK_SUBMISSION#${input.student}`,
      SK: input.taskId
   };

   console.log(`Key: ${JSON.stringify(key)}`)

   const params: UpdateParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      key: key,
      updateExpression: "set graded = :graded, pointsAwarded = :pointsAwarded",
      expressionAttributeValues: {
         ":graded": true,
         ":pointsAwarded": input.awardedPoints // this is wrong
      }
   };
   const output = await dynamodb.update(params);
   if (output.Attributes) {
      return unmarshall(output.Attributes);
   }
}
