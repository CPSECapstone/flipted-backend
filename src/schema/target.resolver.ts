import * as service from "../services/target";

async function addTarget(_: any, args: MutationAddTargetArgs, context: any, info: any) {
   return service.addTarget(args.target);
}

async function getTarget(_: any, args: QueryTargetArgs, context: any, info: any) {
   return service.getTarget(args.course, args.targetId);
}

async function listTargetsByCourse(_: any, args: QueryTargetsArgs, context: any, info: any) {
   return service.listTargetsByCourse(args.course);
}

const resolvers = {
   Query: {
      target: getTarget,
      targets: listTargetsByCourse
   },
   Mutation: {
      addTarget
   }
};

export default resolvers;
