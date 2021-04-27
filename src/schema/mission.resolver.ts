import missionService from "../services/mission";
import subMissionService from "../services/subMission";

async function addMission(_: any, args: any, context: any, info: any) {
   return missionService.addMission(args.mission);
}

async function addSubMission(_: any, args: any, context: any, info: any) {
   return subMissionService.addSubMission(args.subMission);
}

async function getMissionById(_: any, args: any, context: any, info: any) {
   return await missionService.getMissionById(args.missionId);
}

async function getSubMissionById(_: any, args: any, context: any, info: any) {
   return await subMissionService.getSubMissionById(args.subMissionId);
}

async function listMissionsByCourse(_: any, args: any, context: any, info: any) {
   return await missionService.listByCourse(args.course);
}

async function resolveMissionContentType(missionContent: any, context: any, info: any) {
   return missionService.resolveMissionContentType(missionContent);
}

async function getMissionContent(parent: any) {
   return missionService.getMissionContent(parent.id);
}

const resolvers = {
   Query: {
      mission: getMissionById,
      missions: listMissionsByCourse,
      subMission: getSubMissionById
   },
   Mutation: {
      addMission: addMission,
      addSubMission: addSubMission
   },
   Mission: {
      missionContent: getMissionContent
   },
   SubMission: {
      missionContent: getMissionContent
   },
   MissionContent: {
      __resolveType: resolveMissionContentType
   }
};

export default resolvers;
