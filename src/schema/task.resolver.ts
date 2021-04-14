import { Task, TaskInput, TaskProgress} from '../interfaces/taskInterfaces';
import { validateToken } from '../jws-verifer';
import taskService from '../services/task';
import userTypeService from '../services/userRole';
import taskBusLogic from '../buslogic/taskBusLogic'

async function addTask(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization) // first validate the JWT token
   const userRole = await userTypeService.getUserRole(tokenPayload.username) // then get the user role

   if (userRole == "instructor") {
      const task: TaskInput = args.task;
      return taskService.add(task, );
   } else {
     return Error("User is not an instructor")
   }
}

async function submitTaskProgress(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization) 
   
   const taskProgress: TaskProgress = {
      userId: tokenPayload.username,
      ...args.taskProgress
   }

   // verify that the list of completed requirement ids exist in the task
   const task: Task = await taskService.getById(taskProgress.taskId)
   if(taskBusLogic.areTaskProgressIdsValid(task, taskProgress))
   {
      return taskService.updateTaskProgress(taskProgress)
   }

   return Error("Failed to verify ids contained in task submission")
}

async function getTaskById(_: any, args: any, context: any, info: any) {
  const taskId = args.taskId;
  return taskService.getById(taskId);
}

async function listTasksBySubmissionId(_: any, args: any, context: any, info: any) {
  const subMissionId: string = args.subMissionId;
  return taskService.listBySubMissionId(subMissionId);
}

// TODO: QuizBlock
async function resolveTaskBlockType(taskBlock: any, context: any, info: any) {
   if(taskBlock.videoUrl) {
      return 'VideoBlock'
   }
   if(taskBlock.imageUrl) {
      return 'ImageBlock'
   }
   if(taskBlock.fontSize)
   {
      return 'TextBlock'
   }
   return null
}

const resolvers = {
   TaskBlock: {
      __resolveType: resolveTaskBlockType
   },
   Query: {
    task: getTaskById,
    tasks: listTasksBySubmissionId
  },
  Mutation: {
    addTask: addTask,
    submitTaskProgress: submitTaskProgress
  }
};

export default resolvers;
