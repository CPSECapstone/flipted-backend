import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { GraphQLDate } from "graphql-iso-date";

import customType from "./custom.graphql";
import userType from "./user.graphql";
import missionType from "./mission.graphql";
import courseType from "./course.graphql";
import taskType from "./task.graphql";
import quizTaskSubmission from "./quizTaskSubmission.graphql";
import quizBlockType from "./quizblock.graphql";
import learningObjectiveType from "./learningObjective.graphql";

import userResolvers from "./user.resolver";
import courseResolvers from "./course.resolver";
import taskResolvers from "./task.resolver";
import quizTaskSubmissionResolvers from "./quizTaskSubmission.resolver";
import missionResolvers from "./mission.resolver";
import quizBlockResolvers from "./quizblock.resolver";
import learningObjectiveResolvers from "./learningObjective.resolver";

const customScalarResolver = {
   Date: GraphQLDate
};

const typesArray = [
   customType,
   userType,
   missionType,
   courseType,
   taskType,
   quizTaskSubmission,
   quizBlockType,
   learningObjectiveType
];

const resolversArray = [
   customScalarResolver,
   userResolvers,
   courseResolvers,
   taskResolvers,
   missionResolvers,
   quizTaskSubmissionResolvers,
   quizBlockResolvers,
   learningObjectiveResolvers
];

export const typeDefs = mergeTypeDefs(typesArray);
export const resolvers = mergeResolvers(resolversArray);
