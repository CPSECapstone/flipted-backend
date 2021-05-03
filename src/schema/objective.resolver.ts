import * as service from "../services/objective";

async function addObjective(_: any, args: MutationAddObjectiveArgs, context: any, info: any) {
   return service.addObjective(args.objective);
}

async function getObjectiveById(_: any, args: QueryObjectiveArgs, context: any, info: any) {
   return service.getObjectiveById(args.objectiveId);
}

async function listObjectivesByCourse(_: any, args: QueryObjectivesArgs, context: any, info: any) {
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
