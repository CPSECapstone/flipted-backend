import * as service from "../services/target";

async function addTarget(_: any, args: MutationAddTargetArgs, context: any, info: any) {
   return service.addTarget(args.target);
}

async function getTargetById(_: any, args: QueryTargetArgs, context: any, info: any) {
   return service.getTargetById(args.targetId);
}

async function listTargetsByCourse(_: any, args: QueryTargetsArgs, context: any, info: any) {
   return service.listTargetsByCourse(args.course);
}

const resolvers = {
   Query: {
      target: getTargetById,
      targets: listTargetsByCourse
   },
   Mutation: {
      addTarget
   }
};

export default resolvers;
