import { RoleInternal } from "../interfaces/role";
import { validateToken } from "../jws-verifer";
import taskService from "../services/task";
import userService from "../services/user";

async function addTask(_: any, args: MutationAddTaskArgs, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username); // then get the user role
   if (userRole == RoleInternal.Instructor) {
      const task: TaskInput = args.task;
      return taskService.add(task);
   } else {
      return Error("User is not an instructor");
   }
}

async function getTaskById(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const task: Task = await taskService.getTaskById(args.taskId);

   return task;
}

async function listTasksBySubmissionId(_: any, args: any, context: any, info: any) {
   const subMissionId: string = args.subMissionId;
   return taskService.listBySubMissionId(subMissionId);
}

async function getTaskInfoById(_: any, args: QueryTaskInfoArgs, context: any, info: any) {
   return taskService.getTaskInfoById(args.taskId);
}

async function listTasksByCourse(_: any, args: QueryTasksByCourseArgs) {
   return taskService.listTasksByCourse(args.course);
}

// TODO: QuizBlock
async function resolveTaskBlockType(taskBlock: any, context: any, info: any) {
   if (taskBlock.videoUrl) {
      return "VideoBlock";
   }
   if (taskBlock.imageUrl) {
      return "ImageBlock";
   }
   if (taskBlock.fontSize) {
      return "TextBlock";
   }
   if (taskBlock.requiredScore) {
      return "QuizBlock";
   }
   return null;
}

const resolvers = {
   TaskBlock: {
      __resolveType: resolveTaskBlockType
   },
   Query: {
      task: getTaskById,
      tasks: listTasksBySubmissionId,
      taskInfo: getTaskInfoById,
      tasksByCourse: listTasksByCourse
   },
   Mutation: {
      addTask: addTask
   }
};

export default resolvers;
