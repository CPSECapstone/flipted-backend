import { uid } from "uid";
import { GoalItem, SubGoalItem } from "../interfaces/goal";
import { RoleInternal } from "../interfaces/role";
import goalService from "./goal";

export function convertGoalInputToItem(
   goalInput: GoalInput,
   role: RoleInternal,
   username: string,
): GoalItem {
   var username: string;

   if (goalInput.id) {

      var goalItem: GoalItem =  {
         PK: `GOAL#${username}`,
         SK: `GOAL#${goalInput.id}`,
         id: goalInput.id,
         title: goalInput.title,
         dueDate: goalInput.dueDate.toISOString(),
         completed: goalInput.completed,
         subGoals: goalInput.subGoals.map(subGoalInput => {
            return convertSubGoalInputToItem(subGoalInput);
         }),
         category: goalInput.category,
         favorited: goalInput.favorited,
         owner: role == RoleInternal.Instructor && goalInput.owner ? goalInput.owner! : username,
         assignee: role == RoleInternal.Instructor && goalInput.assignee ? goalInput.assignee! : username,
         pointValue: role == RoleInternal.Instructor && goalInput.pointValue ? goalInput.pointValue! : 0
      };

      if(goalInput.completedDate) {
         goalItem.completedDate = goalInput.completedDate.toISOString()
      }

      return goalItem

   } else {
      throw new Error("Missing id in goal input");
   }
}

function convertSubGoalInputToItem(subGoal: SubGoalInput): SubGoalItem {
   var ret: SubGoalItem = {
      title: subGoal.title,
      dueDate: subGoal.dueDate.toISOString(),
      completed: subGoal.completed,
   };

   if (subGoal.completedDate) {
      ret.completedDate = subGoal.completedDate.toISOString()
   }

   return ret
}

function convertItemToSubGoal(subGoalItem: SubGoalItem): SubGoal {
   var ret: SubGoal = {
      title: subGoalItem.title,
      dueDate: new Date(subGoalItem.dueDate),
      completed: subGoalItem.completed,
   };

   if(subGoalItem.completedDate) {
      ret.completedDate = new Date(subGoalItem.completedDate!)
   }

   return ret

}

export function dbGoalItemToGoal(goal: GoalItem): Goal {
   var ret: Goal = {
      id: goal.id,
      title: goal.title,
      dueDate: new Date(goal.dueDate),
      completed: goal.completed,
      category: goal.category,
      favorited: goal.favorited,
      owner: goal.owner,
      assignee: goal.assignee,
      pointValue: goal.pointValue,
      subGoals: goal.subGoals.map(subGoalItem => {
         return convertItemToSubGoal(subGoalItem);
      })
   };

   if(goal.completedDate) {
      ret.completedDate = new Date(goal.completedDate!)
   }

   return ret
}
