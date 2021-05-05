import { unmarshall } from "@aws-sdk/util-dynamodb";
import { GOALS_TABLE_NAME } from "../environment";
import { GoalItem } from "../interfaces/goal";
import { RoleInternal } from "../interfaces/role";
import { QuestionAnswerItem } from "../interfaces/taskSubmission";
import dynamodb, { GetCompositeParams, GetParams, PutCompositeParams, QueryParams } from "./dynamodb";
import { convertGoalInputToItem, dbGoalItemToGoal } from "./goalLogic";
import { dbItemsToQuestionAnswerItems } from "./taskSubmissionHelper";

const GOAL_TABLE = GOALS_TABLE_NAME

async function addGoal(goalInput: GoalInput, username: string, role: RoleInternal) {
    const goalItem: GoalItem = convertGoalInputToItem(goalInput, role, username);
   
    const params: PutCompositeParams = {
        tableName: GOAL_TABLE,
        item: goalItem
    };

    try {
        await dynamodb.putComposite(params);
        return goalInput.id;
     } catch (err) {
        throw err;
     }
}

async function getGoalById(goalId: string, assignee: string): Promise<Goal> {
    const getparams: GetCompositeParams = {
        tableName: GOAL_TABLE,
        key: {
            PK: `GOAL#${assignee}`,
            SK: `GOAL#${goalId}`
        }
    }

    try {
        const output = await dynamodb.getComposite(getparams);
        if (!output.Item) {
           throw new Error(`Goal not found with id=${goalId}`);
        }
        return dbGoalItemToGoal(<GoalItem>unmarshall(output.Item));
     } catch (err) {
        return err;
     }
}

async function getAllUserGoals(username: string): Promise<Goal[]> {
   const params: QueryParams = {
      tableName: GOAL_TABLE,
      keyConditionExpression: "PK = :pkVal",
      expressionAttributeValues: {
         ":pkVal": `GOAL#${username}`,
      }
   };

   const output = await dynamodb.query(params);
   if (output.Items) {
      const goalItems = output.Items.map((item: any) => {
         return <GoalItem>unmarshall(item);
      });

      return goalItems.map(goalItem => {
         return dbGoalItemToGoal(goalItem)
      });
   }
   throw new Error(`Error fetching goals for username=${username}`);
}

const goalService = {
    addGoal,
    getGoalById,
    getAllUserGoals
}

export default goalService