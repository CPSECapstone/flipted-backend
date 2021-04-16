import { Task, TaskInput, TaskProgress} from '../interfaces/taskInterfaces';
import { validateToken } from '../jws-verifer';
import taskService from '../services/task';
import userTypeService from '../services/userRole';
import taskBusLogic from '../services/taskBusLogic'

async function submitTaskProgress(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization) 
   
   const taskProgress: TaskProgress = {
      username: tokenPayload.username,
      ...args.taskProgress
   }

   // verify that the list of completed requirement ids exist in the task
   const task: Task = await taskService.getTaskById(taskProgress.taskId)
   if(taskBusLogic.areTaskProgressIdsValid(task, taskProgress))
   {
      return taskService.updateTaskProgress(taskProgress)
   }

   return Error("Failed to verify ids contained in task submission")
}

const resolvers = {
   Query: {
   
  },
  Mutation: {
    submitTaskProgress: submitTaskProgress
  }
};

export default resolvers;
