import { unmarshall } from "@aws-sdk/util-dynamodb";
import { GOALS_TABLE_NAME } from "../environment";
import { Goal, GoalItem, NewGoalInput } from "../interfaces/goal";
import dynamodb, { GetCompositeParams, PutCompositeParams } from "./dynamodb";
import { convertGoalInputToItem, dbGoalItemToGoal } from "./goalLogic";

const GOAL_TABLE = GOALS_TABLE_NAME

async function addGoal(goalInput: NewGoalInput, username: string, role: string) {
    const goalItem = convertGoalInputToItem(goalInput, username, role);

    const params: PutCompositeParams = {
        tableName: GOAL_TABLE,
        item: goalItem
    };

    try {
        await dynamodb.putComposite(params);
        const [type, id] = goalItem.PK.split("#");
        return id;
     } catch (err) {
        return err;
     }
}

async function getGoalById(goalId: string): Promise<Goal> {
    const getparams: GetCompositeParams = {
        tableName: GOAL_TABLE,
        key: {
            PK: `GOAL#${goalId}`,
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

const goalService = {
    addGoal,
    getGoalById
}

export default goalService