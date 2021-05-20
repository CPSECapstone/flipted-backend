import * as service from "./targetMasteryService";

async function queryClassTargetMastery(_: any, args: QueryClassTargetMasteryArgs) {
   return service.queryClassTargetMastery(args.targetId);
}

const resolvers = {
   Query: {
      classTargetMastery: queryClassTargetMastery
   }
};

export default resolvers;
