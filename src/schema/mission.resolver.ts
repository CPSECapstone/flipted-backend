import { MissionInput, SubMissionInput } from "../interfaces";
import missionService from '../services/mission';
import subMissionService from '../services/subMission';

async function addMission(_: any, args: any, context: any, info: any) {
  const mission: MissionInput = args.mission;
  return missionService.add(mission);
}

async function addSubMission(_: any, args: any, context: any, info: any) {
  const subMission: SubMissionInput = args.subMission;
  return subMissionService.add(subMission);
}

async function getMissionById(_: any, args: any, context: any, info: any) {
  const missionId = args.missionId;
  return missionService.getById(missionId);
}

async function listMissionsByCourse(_: any, args: any, context: any, info: any) {
  const course: string = args.course;
  return missionService.listByCourse(course);
}

async function listSubMissionByMission(_: any, args: any, context: any, info: any) {
  const missionId: string = args.missionId;
  return subMissionService.listByMissionId(missionId);
}

const resolvers = {
  Query: {
    mission: getMissionById,
    missions: listMissionsByCourse,
    subMissions: listSubMissionByMission
  },
  Mutation: {
    addMission: addMission,
    addSubMission: addSubMission
  }
};

export default resolvers;
