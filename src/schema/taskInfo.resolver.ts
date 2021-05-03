import * as service from "../services/taskInfo";

async function addTaskInfo(_: any, args: MutationAddTaskInfoArgs, context: any, info: any) {
   return service.addTaskInfo(args.taskInfo);
}

async function getTaskInfoById(_: any, args: QueryTaskInfoArgs, context: any, info: any) {
   return service.getTaskInfoById(args.taskInfoId);
}

async function listTaskInfosByCourse(_: any, args: QueryTaskInfosArgs, context: any, info: any) {
   return service.listTaskInfosByCourse(args.course);
}

const resolvers = {
   Query: {
      taskInfo: getTaskInfoById,
      taskInfos: listTaskInfosByCourse
   },
   Mutation: {
      addTaskInfo
   }
};

export default resolvers;
