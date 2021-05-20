import * as service from "./missionMasteryService";

async function queryClassMissionMastery(_: any, args: QueryClassMissionMasteryArgs) {
   return service.queryClassMissionMastery(args.courseId, args.missionId);
}

const resolvers = {
   Query: {
      classMissionMastery: queryClassMissionMastery
   }
};

export default resolvers;
