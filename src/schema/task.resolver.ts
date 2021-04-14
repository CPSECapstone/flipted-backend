import { TaskInput } from '../interfaces/taskInterfaces';
import { validateToken } from '../jws-verifer';
import taskService from '../services/task';
import userService from '../services/user';

async function addTask(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization) // first validate the JWT token
   const userRole = await userService.getUserRole(tokenPayload.username) // then get the user role

   if (userRole == "instructor") {
      const task: TaskInput = args.task;
      return taskService.add(task, );
   } else {
     return Error("User is not an instructor")
   }
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
    addTask: addTask
  }
};

export default resolvers;
