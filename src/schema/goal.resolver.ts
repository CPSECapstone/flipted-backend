import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import goalService from "../services/goal";
import { convertGoalInputToItem } from "../services/goalLogic";
import { uid } from "uid";
import { RoleInternal } from "../interfaces/role";
import { FliptedContext } from "../environment";

async function editOrCreateGoal(_: any, args: any, context: FliptedContext, info: any) {
   const goalInput: GoalInput = args.goal;

   // id a uid if this is a new goal
   if (!("id" in goalInput)) {
      goalInput.id = uid();
   }
   return goalService.addGoal(goalInput, context.username, context.userRole);
}

async function getGoalById(_: any, args: any, context: FliptedContext, info: any) {
   if (context.userRole == RoleInternal.Instructor) {
      return await goalService.getGoalById(args.id, args.user);
   }

   return Error("Insufficient permissions");
}

async function getAllGoals(_: any, args: any, context: FliptedContext, info: any) {
   return await goalService.getAllUserGoals(context.username);
}

async function deleteGoal(_: any, args: MutationDeleteGoalArgs, context: FliptedContext, info: any) {
   return await goalService.deleteGoal(args.id, context.username);
}

const resolvers = {
   Query: {
      getGoalById: getGoalById,
      getAllGoals: getAllGoals
   },
   Mutation: {
      editOrCreateGoal: editOrCreateGoal,
      deleteGoal: deleteGoal
   }
};

export default resolvers;
