import { NewGoalInput } from "../interfaces/goal";
import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import goalService from "../services/goal"

async function addGoal(_: any, args: any, context: any, info: any) {
    const tokenPayload = await validateToken(context.headers.Authorization)
    const username = tokenPayload.username
    const userRole = await userService.getUserRole(username)
    
    const goal: NewGoalInput = args.goal
    return goalService.addGoal(goal, username, userRole)
}

async function getGoalById(_: any, args: any, context: any, info: any) {
    return await goalService.getGoalById(args.goalId)
}

const resolvers = {
    Query: {
        goal: getGoalById
    },
    Mutation: {
        addGoal: addGoal
    }
}

export default resolvers