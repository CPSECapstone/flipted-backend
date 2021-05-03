import * as service from "../services/objective";

async function addObjective(_: any, args: any, context: any, info: any) {
   const objective: ObjectiveInput = args.objective;
   return service.addObjective(objective);
}

async function getObjective(_: any, args: QueryObjectiveArgs, context: any, info: any) {
   return service.getObjective(args.course, args.objectiveId);
}

async function listObjectivesByCourse(_: any, args: any, context: any, info: any) {
   const course: string = args.course;
   return service.listObjectivesByCourse(course);
}

const resolvers = {
   Query: {
      objective: getObjective,
      objectives: listObjectivesByCourse
   },
   Mutation: {
      addObjective: addObjective
   }
};

export default resolvers;
