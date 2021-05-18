import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import goalService from "../services/goal"
import { convertGoalInputToItem } from "../services/goalLogic";
import { uid } from "uid";
import { RoleInternal } from "../interfaces/role";

async function editOrCreateGoal(_: any, args: any, context: any, info: any) {
    const tokenPayload = await validateToken(context.headers.Authorization)
    const username = tokenPayload.username
    const userRole = await userService.getUserRole(username)
    
    const goalInput: GoalInput = args.goal
    console.log(username)

    // id a uid if this is a new goal
    if(!("id" in goalInput)){
       goalInput.id = uid()
    }
    return goalService.addGoal(goalInput, username, userRole)
}

async function getGoalById(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization)
   const username = tokenPayload.username
   const userRole = await userService.getUserRole(username)

   if(userRole == RoleInternal.Instructor) {
      return await goalService.getGoalById(args.id, args.user)
   }

   return Error("Insufficient permissions")
}

async function getAllGoals(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization)
   const username = tokenPayload.username
   
   return await goalService.getAllUserGoals(username)
}

async function deleteGoal(_: any, args: any, context: any, info: any) {
    const tokenPayload = await validateToken(context.headers.Authorization)
    const username = tokenPayload.username
    
    return await goalService.deleteGoal(args.id, username)
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
}

export default resolvers