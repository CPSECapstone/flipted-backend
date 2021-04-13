import { LearningObjectiveInput } from "../interfaces";
import learningObjectiveService from '../services/learningObjective';

async function addLearningObjective(_: any, args: any, context: any, info: any) {
  const objective: LearningObjectiveInput = args.objective;
  return learningObjectiveService.add(objective);
}

async function listLearningObjectiveByCourse(_: any, args: any, context: any, info: any) {
  const course: string = args.course;
  return learningObjectiveService.listByCourse(course);
}

const resolvers = {
  Query: {
    learningObjectives: listLearningObjectiveByCourse
  },
  Mutation: {
    addLearningObjective: addLearningObjective
  }
};

export default resolvers;
