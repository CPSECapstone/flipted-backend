import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { GraphQLDate } from "graphql-iso-date";

import customType from "./custom.graphql";
import userType from "./user.graphql";
import missionType from "../mission/mission.graphql";
import courseType from "../course/course.graphql";
import taskType from "../task/task.graphql";
import quizTaskSubmission from "../submissions/taskSubmission.graphql";
import questionType from "./question.graphql";
import taskblockType from "../taskblock/taskblock.graphql";
import objectiveType from "../objective/objective.graphql";
import targetType from "../target/target.graphql";
import progressType from "../progress/progress.graphql";
import goalsType from "./goal.graphql";
import rosterType from "../roster/roster.graphql";
import missionMasteryType from "../missionMastery/missionMastery.graphql";
import targetMasteryType from "../targetMastery/targetMastery.graphql";
import gradingType from "../grading/grading.graphql"
import marketplaceType from "../marketplace/marketplace.graphql"

import userResolvers from "./user.resolver";
import courseResolvers from "../course/course.resolver";
import taskResolvers from "../task/task.resolver";
import questionResolvers from "./question.resolver";
import quizTaskSubmissionResolvers from "../submissions/taskSubmission.resolver";
import missionResolvers from "../mission/mission.resolver";
import taskblockResolvers from "../taskblock/taskblock.resolver";
import objectiveResolvers from "../objective/objective.resolver";
import targetResolvers from "../target/target.resolver";
import progressResolvers from "../progress/progress.resolver";
import goalsResolvers from "./goal.resolver";
import rosterResolvers from "../roster/roster.resolver";
import missionMasteryResolvers from "../missionMastery/missionMastery.resolver";
import targetMasteryResolvers from "../targetMastery/targetMastery.resolver";
import gradingResolvers from "../grading/grading.resolver";
import marketplaceResolvers from "../marketplace/marketplace.resolver";
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
   objectiveType,
   progressType,
   goalsType,
   rosterType,
   missionMasteryType,
   targetMasteryType,
   gradingType,
   marketplaceType
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
   objectiveResolvers,
   progressResolvers,
   goalsResolvers,
   rosterResolvers,
   missionMasteryResolvers,
   targetMasteryResolvers,
   gradingResolvers,
   marketplaceResolvers
];

export const typeDefs = mergeTypeDefs(typesArray);
export const resolvers = mergeResolvers(resolversArray);
