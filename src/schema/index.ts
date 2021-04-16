import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { GraphQLDateTime } from 'graphql-iso-date';

import customType from './custom.graphql';
import userType from './user.graphql';
import missionType from './mission.graphql';
import courseType from './course.graphql';
import taskType from './task.graphql';
import submitTaskType from './submitTask.graphql'
import quizTaskSubmission from './quizTaskSubmission.graphql';
import questionType from './question.graphql';
import learningObjectiveType from './learningObjective.graphql';

import userResolvers from './user.resolver';
import courseResolvers from './course.resolver';
import taskResolvers from './task.resolver';
import quizTaskSubmissionResolvers from './quizTaskSubmission.resolver';
import missionResolvers from './mission.resolver';
import questionResolvers from './question.resolver';
import learningObjectiveResolvers from './learningObjective.resolver';
import submitTaskResolvers from './submitTask.resolver';

const customScalarResolver = {
  Date: GraphQLDateTime
}

const typesArray = [
  customType,
  userType,
  missionType,
  courseType,
  taskType,
  submitTaskType,
  quizTaskSubmission,
  questionType,
  learningObjectiveType
];

const resolversArray = [
  customScalarResolver,
  userResolvers,
  courseResolvers,
  taskResolvers,
  submitTaskResolvers,
  missionResolvers,
  quizTaskSubmissionResolvers,
  questionResolvers,
  learningObjectiveResolvers
];

export const typeDefs = mergeTypeDefs(typesArray);
export const resolvers = mergeResolvers(resolversArray);
