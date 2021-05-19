import * as service from "./missionMsteryService";

async function addMissionMastery(_: any, args: MutationAddMissionMasteryArgs) {
   return service.addMissionMastery(args.mastery);
}

async function queryClasssMissionMastery(_: any, args: QueryClassMissionMasteryArgs) {
   return service.queryClassMissionMastery(args.courseId, args.missionId);
}

const resolvers = {
   Query: {
      classMissionMastery: queryClasssMissionMastery
   },
   Mutation: {
      addMissionMastery
   }
};

export default resolvers;
