import { Task, TaskInput, TaskProgress } from "../interfaces/taskInterfaces";
import { validateToken } from "../jws-verifer";
import taskService from "../services/task";
import userTypeService from "../services/userRole";
import taskBusLogic from "../services/taskBusLogic";

async function submitTaskProgress(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);

   const taskProgress: TaskProgress = {
      username: tokenPayload.username,
      ...args.taskProgress
   };

   // verify that the list of completed requirement ids exist in the task
   const task: Task = await taskService.getTaskById(taskProgress.taskId);
   if (taskBusLogic.areTaskProgressIdsValid(task, taskProgress)) {
      return taskService.updateTaskProgress(taskProgress);
   }

   return Error("Failed to verify ids contained in task submission");
}

async function submitTask(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const username: string = tokenPayload.username;
   const taskId: string = args.taskId;
   const task: Task = await taskService.getTaskById(taskId);

   // This will fail if no task progress has been recorded
   const taskProgress: TaskProgress = await taskService.getTaskProgress(taskId, username);

   // Verify that all rubric requirements are complete
   if (taskBusLogic.isEligibleForSubmission(task, taskProgress)) {
      // create task submission
      // Auto grade task
      // etc
      return taskService.createTaskSubmission(taskId, username);
   } else {
      throw new Error("Task is ineligible for submission. Not all requirements complete");
   }
}

async function retrieveTaskSubmission(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const username: string = tokenPayload.username;

   const taskSubmission = await taskService.getTaskSubmission(args.taskId, username);
   return taskSubmission;
}

const resolvers = {
   Query: {
      retrieveTaskSubmission: retrieveTaskSubmission
   },
   Mutation: {
      submitTaskProgress: submitTaskProgress,
      submitTask: submitTask
   }
};

export default resolvers;
