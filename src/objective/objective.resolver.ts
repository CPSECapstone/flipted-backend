import taskService from "../services/task";
import * as service from "./objectiveService";

async function addObjective(_: any, args: MutationAddObjectiveArgs) {
   return service.addObjective(args.objective);
}

async function getObjectiveById(_: any, args: QueryObjectiveArgs) {
   return service.getObjectiveById(args.objectiveId);
}

export async function getObjective(parent: any) {
   return service.getObjectiveById(parent.objectiveId);
}

async function listObjectivesByCourse(_: any, args: QueryObjectivesArgs) {
   return service.listObjectivesByCourse(args.course);
}

const resolvers = {
   Query: {
      objective: getObjectiveById,
      objectives: listObjectivesByCourse
   },
   Mutation: {
      addObjective
   }
};

export default resolvers;
