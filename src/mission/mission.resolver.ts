import * as missionService from "./missionService";
import subMissionService from "./subMission";
import { validateToken } from "../jws-verifer";
import userService from "../services/user";
import { RoleInternal } from "../interfaces/role";

async function addMission(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username);
   if (userRole == RoleInternal.Instructor) {
      return missionService.addMission(args.mission);
   } else {
      return Error("User is not an instructor");
   }
}

async function addSubMission(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const userRole = await userService.getUserRole(tokenPayload.username);
   if (userRole == RoleInternal.Instructor) {
      return subMissionService.addSubMission(args.subMission);
   } else {
      return Error("User is not an instructor");
   }
}

async function getMissionById(_: any, args: any, context: any, info: any) {
   await validateToken(context.headers.Authorization);
   return await missionService.getMissionById(args.missionId);
}

async function getSubMissionById(_: any, args: any, context: any, info: any) {
   await validateToken(context.headers.Authorization);
   return await subMissionService.getSubMissionById(args.subMissionId);
}

async function listMissionsByCourse(_: any, args: any, context: any, info: any) {
   await validateToken(context.headers.Authorization);
   return await missionService.listByCourse(args.course);
}

async function resolveMissionContentType(missionContent: any, context: any, info: any) {
   await validateToken(context.headers.Authorization);
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
