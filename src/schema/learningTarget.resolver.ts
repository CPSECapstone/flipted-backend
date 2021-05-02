import * as service from "../services/learningTarget";

async function addLearningTarget(_: any, args: any, context: any, info: any) {
   const target: LearningTarget = args.target;
   return service.addLearningTarget(target);
}

async function getTargetById(_: any, args: any, context: any, info: any) {
   const targetId: string = args.targetId;
   return service.getTargetById(targetId);
}

async function listTargetsByCourse(_: any, args: any, context: any, info: any) {
   const course: string = args.course;
   return service.listTargetsByCourse(course);
}

const resolvers = {
   Query: {
      learningTarget: getTargetById,
      learningTargets: listTargetsByCourse
   },
   Mutation: {
      addLearningTarget
   }
};

export default resolvers;
