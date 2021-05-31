import { unmarshall } from "@aws-sdk/util-dynamodb";
import { MASTERY_TABLE, TASK_SUBMISSIONS_TABLE } from "../environment";
import { MasteryPK, MasterySK } from "../progress/progressInterface";
import dynamodb from "../services/dynamodb";

export async function updateMastery(input: ObjectiveTaskMasteryInput) {
   const key: CompositeDBItem = {
      PK: MasteryPK(input.student),
      SK: MasterySK(input.objectiveId, input.taskId)
   };

   const params: UpdateParams = {
      tableName: MASTERY_TABLE,
      key: key,
      conditionExpression: "attribute_exists(SK)",
      updateExpression:
         "set mastery = :mastery",
      expressionAttributeValues: {
         ":mastery": input.mastery,
      }
   };
   try {
      await dynamodb.update(params);
   } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
         throw new Error(
            `Objective: ${input.objectiveId} Task: ${input.taskId} Mastery for user ${input.student} could not be found`
         );
      }
      throw err;
   }
}

export async function updateTaskGrade(input: TaskSubmissionGradeInput) {
   const key: CompositeDBItem = {
      PK: `TASK_SUBMISSION#${input.student}`,
      SK: input.taskId
   };

   const params: UpdateParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      key: key,
      conditionExpression: "attribute_exists(SK)",
      updateExpression:
         "set graded = :graded, pointsAwarded = :pointsAwarded, teacherComment = :teacherComment",
      expressionAttributeValues: {
         ":graded": true,
         ":pointsAwarded": input.pointsAwarded, // this is wrong
         ":teacherComment": input.teacherComment ? input.teacherComment : null
      }
   };
   try {
      const output = await dynamodb.update(params);
      console.log(output);
      if (output.Attributes) {
         return unmarshall(output.Attributes);
      }
   } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
         throw new Error(
            `Task submission ${input.taskId} for user ${input.student} could not be found`
         );
      }
      throw err;
   }
}

export async function updateAnswerGrade(input: AnswerGradeInput) {
   const key: CompositeDBItem = {
      PK: `QUESTION_ANSWER#${input.student}`,
      SK: input.questionId
   };

   const params: UpdateParams = {
      tableName: TASK_SUBMISSIONS_TABLE,
      conditionExpression: "attribute_exists(SK)",
      key: key,
      updateExpression:
         "set graded = :graded, pointsAwarded = :pointsAwarded, teacherComment = :teacherComment",
      expressionAttributeValues: {
         ":graded": true,
         ":pointsAwarded": input.pointsAwarded,
         ":teacherComment": input.teacherComment ? input.teacherComment : null
      }
   };
   try {
      const output = await dynamodb.update(params);
      console.log(output);
      if (output.Attributes) {
         return unmarshall(output.Attributes);
      }
   } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
         throw new Error(
            `Question submission ${input.questionId} for user ${input.student} could not be found`
         );
      }
      throw err;
   }
}
