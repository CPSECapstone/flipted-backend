import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { GraphQLDate } from "graphql-iso-date";

import customType from "./custom.graphql";
import userType from "./user.graphql";
import missionType from "./mission.graphql";
import courseType from "./course.graphql";
import taskType from "./task.graphql";
import quizTaskSubmission from "./taskSubmission.graphql";
import questionType from "./question.graphql";
import taskblockType from "./taskblock.graphql";
import objectiveType from "./objective.graphql";
import targetType from "./target.graphql";

import userResolvers from "./user.resolver";
import courseResolvers from "./course.resolver";
import taskResolvers from "./task.resolver";
import questionResolvers from "./question.resolver";
import quizTaskSubmissionResolvers from "./taskSubmission.resolver";
import missionResolvers from "./mission.resolver";
import taskblockResolvers from "./taskblock.resolver";
import objectiveResolvers from "./objective.resolver";
import targetResolvers from "./target.resolver";

const customScalarResolver = {
   Date: GraphQLDate
};

const typesArray = [
   customType,
   userType,
   missionType,
   courseType,
   taskType,
   questionType,
   quizTaskSubmission,
   taskblockType,
   targetType,
   objectiveType
];

const resolversArray = [
   customScalarResolver,
   userResolvers,
   courseResolvers,
   taskResolvers,
   missionResolvers,
   questionResolvers,
   quizTaskSubmissionResolvers,
   taskblockResolvers,
   targetResolvers,
   objectiveResolvers
];

export const typeDefs = mergeTypeDefs(typesArray);
export const resolvers = mergeResolvers(resolversArray);
