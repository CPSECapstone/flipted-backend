import * as service from "./targetService";

async function addTarget(_: any, args: MutationAddTargetArgs) {
   return service.addTarget(args.target);
}

async function getTargetById(_: any, args: QueryTargetArgs) {
   return service.getTargetById(args.targetId);
}

async function listTargetsByCourse(_: any, args: QueryTargetsArgs) {
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
