import { uid } from "uid";
import { Goal, GoalItem, NewGoalInput } from "../interfaces/goal";

export function convertGoalInputToItem(goalInput: NewGoalInput, username: string, role: string): GoalItem {
    const goal_uid = uid()
    var assignee: string
    var pointValue: number
    if (role == "instructor") {
        assignee = goalInput.assignee!
        pointValue = goalInput.pointValue!
    } else {
        assignee = username
        pointValue = 0
    }
    return {
        PK: `GOAL#${goal_uid}`,
        SK: `GOAL#${goal_uid}`,
        id: goal_uid,
        title: goalInput.title,
        dueDate: goalInput.dueDate,
        completed: false,
        subGoals: [],
        category: goalInput.category,
        favorited: false,
        owner: username,
        assignee: assignee,
        pointValue: pointValue,
    }
}

export function dbGoalItemToGoal(goal: GoalItem): Goal {
    const [type, goalId] = goal.PK.split("#")
    return {
        id: goalId,
        title: goal.title,
        dueDate: goal.dueDate,
        completed: goal.completed,
        completedDate: goal.completedDate,
        category: goal.category,
        favorited: goal.favorited,
        owner: goal.owner,
        assignee: goal.assignee,
        pointValue: goal.pointValue
    }
}