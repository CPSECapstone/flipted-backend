import { unmarshall } from "@aws-sdk/util-dynamodb";
import { TASK_SUBMISSIONS_TABLE } from "../environment";
import dynamodb from "../services/dynamodb";

export async function updateTaskGrade(input: TaskSubmissionGradeInput) {
   const key: CompositeDBItem = {
      PK: `TASK_SUBMISSION#${input.student}`,
      SK: input.taskId
   };

   const params: UpdateParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      key: key,
      updateExpression: "set graded = :graded, pointsAwarded = :pointsAwarded, teacherComment = :teacherComment",
      expressionAttributeValues: {
         ":graded": true,
         ":pointsAwarded": input.pointsAwarded, // this is wrong
         ":teacherComment": input.teacherComment ? input.teacherComment : null
      }
   };
   const output = await dynamodb.update(params);
   if (output.Attributes) {
      return unmarshall(output.Attributes);
   }
}

export async function updateAnswerGrade(input: AnswerGradeInput) {
   const key: CompositeDBItem = {
      PK: `QUESTION_ANSWER#${input.student}`,
      SK: input.questionId
   };

   const params: UpdateParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      key: key,
      updateExpression: "set graded = :graded, pointsAwarded = :pointsAwarded, teacherComment = :teacherComment",
      expressionAttributeValues: {
         ":graded": true,
         ":pointsAwarded": input.pointsAwarded,
         ":teacherComment": input.teacherComment ? input.teacherComment : null
      }
   };
   const output = await dynamodb.update(params);
   if (output.Attributes) {
      return unmarshall(output.Attributes);
   }
}