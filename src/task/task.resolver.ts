import { RoleInternal } from "../interfaces/role";
import { validateToken } from "../jws-verifer";
import taskService from "./task.service";
import userService from "../services/user";

async function addTask(_: any, args: MutationAddTaskArgs, context: FliptedContext, info: any) {
   if (context.userRole == RoleInternal.Instructor) {
      const task: TaskInput = args.task;
      return taskService.add(task);
   } else {
      return Error("User is not an instructor");
   }
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
   Task: {
      pages: (parent: any) => {
         return taskService.getTaskPagesById(parent.id)
      }
   },
   TaskBlock: {
      __resolveType: resolveTaskBlockType
   },
   Query: {
      task: getTaskInfoById,
      tasks: listTasksBySubmissionId,
      taskInfo: getTaskInfoById,
      tasksByCourse: listTasksByCourse
   },
   Mutation: {
      addTask: addTask
   }
};

export default resolvers;
