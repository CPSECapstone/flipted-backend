import * as service from "./missionMsteryService";

async function queryClasssMissionMastery(_: any, args: QueryClassMissionMasteryArgs) {
   return service.queryClassMissionMastery(args.courseId, args.missionId);
}

const resolvers = {
   Query: {
      classMissionMastery: queryClasssMissionMastery
   }
};

export default resolvers;
