import { TaskInput } from "../interfaces";
import taskService from '../services/task';

async function addTask(_: any, args: any, context: any, info: any) {
  const task: TaskInput = args.task;
  return taskService.add(task);
}

async function getTaskById(_: any, args: any, context: any, info: any) {
  const taskId = args.taskId;
  return taskService.getById(taskId);
}

async function listTasksBySubmissionId(_: any, args: any, context: any, info: any) {
  const subMissionId: string = args.subMissionId;
  return taskService.listBySubMissionId(subMissionId);
}

const resolvers = {
  Query: {
    task: getTaskById,
    tasks: listTasksBySubmissionId
  },
  Mutation: {
    addTask: addTask
  }
};

export default resolvers;
