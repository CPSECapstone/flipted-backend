import * as service from "../services/objective";

async function addObjective(_: any, args: MutationAddObjectiveArgs, context: any, info: any) {
   return service.addObjective(args.objective);
}

async function getObjective(_: any, args: QueryObjectiveArgs, context: any, info: any) {
   return service.getObjective(args.courseName, args.objectiveName);
}

async function listObjectivesByCourse(_: any, args: QueryObjectivesArgs, context: any, info: any) {
   return service.listObjectivesByCourse(args.courseName);
}

const resolvers = {
   Query: {
      objective: getObjective,
      objectives: listObjectivesByCourse
   },
   Mutation: {
      addObjective
   }
};

export default resolvers;
